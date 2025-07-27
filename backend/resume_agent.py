import os
import sqlite3
import PyPDF2
from sentence_transformers import SentenceTransformer, util

class ResumeAgent:
    def __init__(self):
        """
        Initializes the agent and loads the AI model into memory.
        This happens only once when the server starts.
        """
        print("Loading AI model for ResumeAgent...")
        # 'all-MiniLM-L6-v2' is a great, fast model perfect for this task.
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("AI model loaded successfully.")

    def _get_db_connection(self):
        """Helper to connect to the database."""
        conn = sqlite3.connect('consultants.db')
        conn.row_factory = sqlite3.Row
        return conn

    def _read_pdf_text(self, file_path):
        """Helper to read all text from a PDF file."""
        try:
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text()
                return text
        except Exception as e:
            print(f"Error reading PDF {file_path}: {e}")
            return "" # Return empty string if PDF is unreadable

    def search(self, search_query):
        """
        The main search function. It finds the most relevant resumes
        for a given search query.
        """
        if not search_query:
            return []

        # 1. Get all consultants from the database
        conn = self._get_db_connection()
        consultants = conn.execute('SELECT id, name, skills, resume_path FROM consultants').fetchall()
        conn.close()

        # 2. Read resume text and filter for valid ones
        resume_texts = []
        valid_consultants = []
        for consultant in consultants:
            if consultant['resume_path'] and os.path.exists(consultant['resume_path']):
                text = self._read_pdf_text(consultant['resume_path'])
                if text:
                    resume_texts.append(text)
                    valid_consultants.append(dict(consultant))

        if not resume_texts:
            return []

        # 3. Create embeddings for resumes and the search query
        resume_embeddings = self.model.encode(resume_texts, convert_to_tensor=True)
        query_embedding = self.model.encode(search_query, convert_to_tensor=True)

        # 4. Calculate similarity scores between the query and all resumes
        cosine_scores = util.cos_sim(query_embedding, resume_embeddings)

        # 5. Combine consultants with their scores
        search_results = []
        for i in range(len(valid_consultants)):
            search_results.append({
                'consultant': valid_consultants[i],
                'score': round(cosine_scores[0][i].item(), 4)
            })

        # 6. Sort results by score, highest first
        sorted_results = sorted(search_results, key=lambda x: x['score'], reverse=True)

        return sorted_results

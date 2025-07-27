import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
# --- NEW: Import our agent ---
from resume_agent import ResumeAgent

app = Flask(__name__)
CORS(app)

# --- Configuration (no change) ---
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- NEW: Create an instance of our agent when the server starts ---
resume_agent = ResumeAgent()

# --- Database Functions (no change) ---
def get_db_connection():
    conn = sqlite3.connect('consultants.db')
    conn.row_factory = sqlite3.Row
    return conn

# --- Existing API Endpoints (no change) ---
@app.route('/api/consultants', methods=['GET'])
def get_consultants():
    # ... This code is the same as your old file
    conn = get_db_connection()
    consultants_query = conn.execute('SELECT * FROM consultants').fetchall()
    conn.close()
    consultants = [dict(row) for row in consultants_query]
    return jsonify(consultants)

@app.route('/api/consultants', methods=['POST'])
def add_consultant():
    # ... This code is the same as your old file
    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file part'}), 400
    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    name = request.form['name']
    email = request.form['email']
    skills = request.form['skills']
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        conn = get_db_connection()
        conn.execute('INSERT INTO consultants (name, email, skills, resume_path) VALUES (?, ?, ?, ?)',
                     (name, email, skills, file_path))
        conn.commit()
        conn.close()
        return jsonify({'status': 'Consultant and resume added successfully'}), 201

# --- NEW AI SEARCH ENDPOINT ---
@app.route('/api/search', methods=['POST'])
def search_resumes_endpoint():
    search_query = request.get_json().get('query')
    # Delegate the heavy lifting to our agent
    results = resume_agent.search(search_query)
    return jsonify(results)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

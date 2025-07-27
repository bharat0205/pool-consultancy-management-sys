import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from resume_agent import ResumeAgent

app = Flask(__name__)
CORS(app)

# --- Configuration & Agent (No Change) ---
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
resume_agent = ResumeAgent()

# --- Database Connection (No Change) ---
def get_db_connection():
    conn = sqlite3.connect('consultants.db')
    conn.row_factory = sqlite3.Row
    return conn

# --- Existing Endpoints (No Change) ---
@app.route('/api/consultants', methods=['GET'])
def get_consultants():
    # ... (Your existing code here)
    conn = get_db_connection()
    consultants_query = conn.execute('SELECT * FROM consultants').fetchall()
    conn.close()
    consultants = [dict(row) for row in consultants_query]
    return jsonify(consultants)

@app.route('/api/consultants', methods=['POST'])
def add_consultant():
    # ... (Your existing code here)
    if 'resume' not in request.files: return jsonify({'error': 'No resume file part'}), 400
    file = request.files['resume']
    if file.filename == '': return jsonify({'error': 'No selected file'}), 400
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

@app.route('/api/search', methods=['POST'])
def search_resumes_endpoint():
    # ... (Your existing code here)
    search_query = request.get_json().get('query')
    results = resume_agent.search(search_query)
    return jsonify(results)

@app.route('/api/consultants/<int:id>', methods=['DELETE'])
def delete_consultant(id):
    # ... (Your existing code here)
    conn = get_db_connection()
    consultant = conn.execute('SELECT resume_path FROM consultants WHERE id = ?', (id,)).fetchone()
    conn.execute('DELETE FROM consultants WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    if consultant and consultant['resume_path'] and os.path.exists(consultant['resume_path']):
        os.remove(consultant['resume_path'])
    return jsonify({'status': 'Consultant deleted successfully'})


# --- NEW: Endpoint to GET a single consultant's details ---
@app.route('/api/consultant/<int:id>', methods=['GET'])
def get_consultant(id):
    conn = get_db_connection()
    consultant = conn.execute('SELECT * FROM consultants WHERE id = ?', (id,)).fetchone()
    conn.close()
    if consultant is None:
        return jsonify({'error': 'Consultant not found'}), 404
    return jsonify(dict(consultant))

# --- NEW: Endpoint to UPDATE a consultant's details (PUT) ---
@app.route('/api/consultants/<int:id>', methods=['PUT'])
def update_consultant(id):
    consultant_data = request.get_json()
    name = consultant_data.get('name')
    email = consultant_data.get('email')
    skills = consultant_data.get('skills')

    conn = get_db_connection()
    conn.execute('UPDATE consultants SET name = ?, email = ?, skills = ? WHERE id = ?',
                 (name, email, skills, id))
    conn.commit()
    conn.close()

    return jsonify({'status': 'Consultant updated successfully'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

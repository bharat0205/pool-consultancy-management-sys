import sqlite3
# We need to import 'request' to handle incoming data
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = sqlite3.connect('consultants.db')
    conn.row_factory = sqlite3.Row
    return conn

# This endpoint for GETTING all consultants remains the same
@app.route('/api/consultants', methods=['GET'])
def get_consultants():
    conn = get_db_connection()
    consultants_query = conn.execute('SELECT * FROM consultants').fetchall()
    conn.close()
    consultants = [dict(row) for row in consultants_query]
    return jsonify(consultants)

# --- NEW CODE STARTS HERE ---
# This is our new endpoint for ADDING a consultant.
# Note that it uses the same URL but handles the 'POST' method.
@app.route('/api/consultants', methods=['POST'])
def add_consultant():
    # Get the data sent from the frontend form
    new_consultant = request.get_json()
    name = new_consultant['name']
    email = new_consultant['email']
    skills = new_consultant['skills']

    conn = get_db_connection()
    # Use an SQL INSERT command to add the new data to the table
    conn.execute('INSERT INTO consultants (name, email, skills) VALUES (?, ?, ?)',
                 (name, email, skills))
    # Commit the transaction to save the changes permanently
    conn.commit()
    conn.close()
    
    # Return a success message and a "201 Created" status code
    return jsonify({'status': 'Consultant added successfully'}), 201
# --- NEW CODE ENDS HERE ---


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

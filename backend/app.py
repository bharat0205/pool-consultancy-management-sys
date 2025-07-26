from flask import Flask, jsonify
from flask_cors import CORS

# This line initializes your web application.
app = Flask(__name__)

# This line allows your React frontend (running on a different address)
# to make requests to this backend. It's a security requirement.
CORS(app)

# Here is some temporary, fake data. Later, we will get this from a real database.
fake_consultants = [
    {
        "id": 1,
        "name": "John Doe",
        "skills": "Python, React, SQL",
        "resume_status": "Updated"
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "skills": "Java, Angular, Cloud",
        "resume_status": "Pending Review"
    },
    {
        "id": 3,
        "name": "Peter Jones",
        "skills": "Data Science, Machine Learning",
        "resume_status": "Not Updated"
    }
]

# This is an API endpoint. When a web browser asks for the '/api/consultants' URL,
# this function will run and return the fake_consultants data in JSON format.
@app.route('/api/consultants', methods=['GET'])
def get_consultants():
    return jsonify(fake_consultants)


# This part of the script makes the server runnable.
# When you execute "python app.py", this is the code that starts the server.
if __name__ == '__main__':
    # debug=True makes the server auto-restart whenever you save changes to the file.
    app.run(host='0.0.0.0', port=5000, debug=True)

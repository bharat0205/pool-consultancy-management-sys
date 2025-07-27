import sqlite3

connection = sqlite3.connect('consultants.db')

with open('../database/schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

# The INSERT command must match the number of columns
cur.execute("INSERT INTO consultants (name, email, skills, resume_status, resume_path) VALUES (?, ?, ?, ?, ?)",
            ('Bharat Kumar', 'bharat.k@example.com', 'Python, React, SQL', 'Updated', None)
            )

connection.commit()
connection.close()

print("Database re-initialized successfully with the correct schema.")

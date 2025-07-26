import sqlite3

# Connect to the database file (it will be created if it doesn't exist)
connection = sqlite3.connect('consultants.db')

# Open the schema.sql file and read its content
with open('../database/schema.sql') as f:
    connection.executescript(f.read())

# Create a cursor to execute SQL commands
cur = connection.cursor()

# Insert some sample data so our app has something to show
cur.execute("INSERT INTO consultants (name, email, skills, resume_status) VALUES (?, ?, ?, ?)",
            ('Bharat Kumar', 'bharat.k@example.com', 'Python, React, SQL', 'Updated')
            )

cur.execute("INSERT INTO consultants (name, email, skills, resume_status) VALUES (?, ?, ?, ?)",
            ('Priya Sharma', 'priya.s@example.com', 'Java, Spring, Cloud', 'Pending Review')
            )

cur.execute("INSERT INTO consultants (name, email, skills, resume_status) VALUES (?, ?, ?, ?)",
            ('Amit Singh', 'amit.s@example.com', 'Data Science, Pandas, ML', 'Not Updated')
            )

# Commit the changes to the database and close the connection
connection.commit()
connection.close()

print("Database initialized and seeded successfully.")

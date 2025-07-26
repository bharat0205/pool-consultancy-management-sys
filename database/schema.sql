-- This command deletes the table if it already exists, so we can re-run the script anytime.
DROP TABLE IF EXISTS consultants;

CREATE TABLE consultants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    skills TEXT,
    resume_status TEXT DEFAULT 'Not Updated',
    attendance_score INTEGER DEFAULT 100
);

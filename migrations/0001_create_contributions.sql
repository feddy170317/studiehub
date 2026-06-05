-- Underplan D: Contributions table for user-submitted materials
-- Status: pending | approved | rejected

CREATE TABLE contributions (
  id TEXT PRIMARY KEY,
  education_id TEXT NOT NULL,
  semester_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  ref TEXT,
  note TEXT,
  author TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lesson_status ON contributions(lesson_id, status);
CREATE INDEX idx_created_at ON contributions(created_at);
CREATE INDEX idx_education_semester ON contributions(education_id, semester_id);

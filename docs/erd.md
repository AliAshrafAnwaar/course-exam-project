# Course Exam Management System - Entity Relationship Diagram

## Final ERD Structure (10 Tables)

```
==============================================
                  ERD DIAGRAM
==============================================

┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│     ROLES       │         │   PERMISSIONS   │         │      USERS      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄──┐ ┌──►│ id (PK)         │         │ id (PK)         │
│ name (UK)       │   │ │   │ name (UK)       │    ┌───►│ username (UK)   │
│ description     │   │ │   │ resource        │    │    │ email (UK)      │
│ created_at      │   │ │   │ action          │    │    │ password_hash   │
│ updated_at      │   │ │   │ created_at      │    │    │ full_name       │
└─────────────────┘   │ │   │ updated_at      │    │    │ role_id (FK)────┼───┐
         │            │ │   └─────────────────┘    │    │ is_active       │   │
         │            │ │                          │    │ created_at      │   │
         ▼ 1:M        │ │                          │    │ updated_at      │   │
┌─────────────────────┴─┴─┐                        │    └─────────────────┘   │
│    ROLE_PERMISSIONS     │                        │             │            │
├─────────────────────────┤                        │             │ 1:M        │
│ id (PK)                 │                        │             ▼            │
│ role_id (FK)            │                        │    ┌─────────────────┐   │
│ permission_id (FK)      │                        │    │    COURSES      │   │
│ created_at              │                        │    ├─────────────────┤   │
└─────────────────────────┘                        │    │ id (PK)         │   │
                                                   │    │ name            │   │
                                                   │    │ description     │   │
                                                   └────┤ created_by (FK) │   │
                                                        │ created_at      │   │
                                                        │ updated_at      │   │
                                                        └─────────────────┘   │
                                                                 │            │
                                     ┌───────────────────────────┼────────────┘
                                     │                           │
                                     ▼ 1:M                       ▼ 1:M
                            ┌─────────────────┐         ┌─────────────────┐
                            │    CHAPTERS     │         │      EXAMS      │
                            ├─────────────────┤         ├─────────────────┤
                            │ id (PK)         │◄───┐    │ id (PK)         │
                            │ course_id (FK)  │    │    │ course_id (FK)  │
                            │ name            │    │    │ name            │
                            │ chapter_number  │    │    │ total_questions │
                            │ created_at      │    │    │ req_simple_count│
                            │ updated_at      │    │    │ req_difficult.. │
                            └─────────────────┘    │    │ req_reminding.. │
                                     │             │    │ req_understand..│
                                     │ 1:M         │    │ req_creativity..│
                                     ▼             │    │ created_by (FK) │
                            ┌─────────────────┐    │    │ created_at      │
                            │   QUESTIONS     │    │    │ updated_at      │
                            ├─────────────────┤    │    └─────────────────┘
                            │ id (PK)         │◄───┼──────────┐ │
                            │ chapter_id (FK) │    │          │ │ 1:M
                            │ question_text   │    │          │ ▼
                            │ choice_1        │    │  ┌───────┴─────────────┐
                            │ choice_2        │    │  │EXAM_CHAPTER_REQUIRE.│
                            │ choice_3        │    │  ├─────────────────────┤
                            │ correct_choice  │    │  │ id (PK)             │
                            │ difficulty      │    └──┤ chapter_id (FK)     │
                            │ objective       │       │ exam_id (FK)        │
                            │ created_by (FK) │       │ required_question.. │
                            │ created_at      │       │ created_at          │
                            │ updated_at      │       │ updated_at          │
                            └─────────────────┘       └─────────────────────┘
                                     │
                                     │ M:N
                                     ▼
                            ┌─────────────────┐
                            │  EXAM_QUESTIONS │
                            ├─────────────────┤
                            │ id (PK)         │
                            │ exam_id (FK)    │
                            │ question_id (FK)│
                            │ question_order  │
                            │ created_at      │
                            └─────────────────┘
```

---

## Entity Descriptions

### 1. ROLE
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Role name: 'Student', 'Teacher', 'Manager', 'Admin', 'Super Admin' |
| description | TEXT | - | Role description |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 2. PERMISSION
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Permission name (e.g., 'create_exam', 'view_questions') |
| resource | VARCHAR(50) | NOT NULL | Resource type: 'exam', 'question', 'course', 'user', 'chapter' |
| action | VARCHAR(20) | NOT NULL | Action type: 'create', 'read', 'update', 'delete' |
| description | TEXT | - | Permission description |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 3. ROLE_PERMISSION (Junction Table)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| role_id | INTEGER | FK → roles.id, NOT NULL | Role reference |
| permission_id | INTEGER | FK → permissions.id, NOT NULL | Permission reference |
| | | PRIMARY KEY (role_id, permission_id) | Composite primary key |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

### 4. USER
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Username for login |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| full_name | VARCHAR(100) | - | User's full name |
| role_id | INTEGER | FK → roles.id | User role |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 5. COURSE
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Course name |
| description | TEXT | - | Course description |
| created_by | INTEGER | FK → users.id, NOT NULL | Creator user (Teacher) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 6. CHAPTER
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| chapterNumber | INTEGER | NOT NULL | Chapter order (1, 2, 3...) |
| title | VARCHAR(255) | - | Chapter title (optional) |
| course_id | INTEGER | FK → courses.id, NOT NULL | Parent course |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |
| | | UNIQUE(course_id, chapterNumber) | No duplicate chapter numbers |

### 7. QUESTION
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| question_text | TEXT | NOT NULL | Question content |
| choice_1 | VARCHAR(500) | NOT NULL | First choice |
| choice_2 | VARCHAR(500) | NOT NULL | Second choice |
| choice_3 | VARCHAR(500) | NOT NULL | Third choice |
| correct_answer | INTEGER | NOT NULL, CHECK (1-3) | Correct answer: 1, 2, or 3 |
| difficulty | ENUM | NOT NULL | 'simple' or 'difficult' |
| objective | ENUM | NOT NULL | 'reminding', 'understanding', or 'creativity' |
| chapter_id | INTEGER | FK → chapters.id, NOT NULL | Parent chapter |
| created_by | INTEGER | FK → users.id, NOT NULL | Creator user (Teacher) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 8. EXAM
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(255) | NOT NULL | Exam name |
| course_id | INTEGER | FK → courses.id, NOT NULL | Parent course |
| created_by | INTEGER | FK → users.id, NOT NULL | Creator user (Teacher) |
| total_questions | INTEGER | NOT NULL | Total questions in exam |
| req_simple_count | INTEGER | NOT NULL, DEFAULT 0 | Required simple questions |
| req_difficult_count | INTEGER | NOT NULL, DEFAULT 0 | Required difficult questions |
| req_reminding_count | INTEGER | NOT NULL, DEFAULT 0 | Required reminding questions |
| req_understanding_count | INTEGER | NOT NULL, DEFAULT 0 | Required understanding questions |
| req_creativity_count | INTEGER | NOT NULL, DEFAULT 0 | Required creativity questions |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 9. EXAM_CHAPTER_REQUIREMENT
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| exam_id | INTEGER | FK → exams.id, NOT NULL | Parent exam |
| chapter_id | INTEGER | FK → chapters.id, NOT NULL | Target chapter |
| required_question_count | INTEGER | NOT NULL, DEFAULT 0 | Questions required from this chapter |
| | | UNIQUE(exam_id, chapter_id) | One requirement per chapter per exam |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Update timestamp |

### 10. EXAM_QUESTION (Junction Table)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| exam_id | INTEGER | FK → exams.id, NOT NULL | Parent exam |
| question_id | INTEGER | FK → questions.id, NOT NULL | Selected question |
| question_order | INTEGER | - | Order of question in exam |
| | | PRIMARY KEY (exam_id, question_id) | Composite primary key |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

---

## Relationships Summary

### Authentication & Authorization
| From | To | Type | Description |
|------|-----|------|-------------|
| ROLE | USER | 1:M | One role has many users |
| ROLE | ROLE_PERMISSION | 1:M | One role has many permissions |
| PERMISSION | ROLE_PERMISSION | 1:M | One permission assigned to many roles |

### Ownership/Audit Trail
| From | To | Type | Description |
|------|-----|------|-------------|
| USER | COURSE | 1:M | One user creates many courses (created_by) |
| USER | QUESTION | 1:M | One user creates many questions (created_by) |
| USER | EXAM | 1:M | One user creates many exams (created_by) |

### Core System
| From | To | Type | Description |
|------|-----|------|-------------|
| COURSE | CHAPTER | 1:M | One course has many chapters |
| COURSE | EXAM | 1:M | One course has many exams |
| CHAPTER | QUESTION | 1:M | One chapter has many questions (12 for seeding) |
| CHAPTER | EXAM_CHAPTER_REQUIREMENT | 1:M | One chapter appears in many exam requirements |
| EXAM | EXAM_CHAPTER_REQUIREMENT | 1:M | One exam has requirements for multiple chapters |
| EXAM | EXAM_QUESTION | 1:M | One exam contains many questions |
| QUESTION | EXAM_QUESTION | 1:M | One question can appear in many exams |

---

## Business Rules

### Question Distribution (Seeding)
- Each chapter MUST have **12 questions**
- Distribution: **2 questions per difficulty-objective combination**
  - 2 × simple-reminding
  - 2 × simple-understanding
  - 2 × simple-creativity
  - 2 × difficult-reminding
  - 2 × difficult-understanding
  - 2 × difficult-creativity

### Exam Constraints
- `total_questions` = Sum of all `exam_chapter_requirements.required_question_count`
- `req_simple_count + req_difficult_count` = `total_questions`
- `req_reminding_count + req_understanding_count + req_creativity_count` = `total_questions`
- No duplicate questions in an exam (enforced by EXAM_QUESTION PK)

### Exam Generation (Genetic Algorithm)
- Uses fitness function to evaluate question selection
- Optimizes for: chapter distribution, difficulty distribution, objective distribution
- Single algorithm: **Genetic Algorithm** (no fallback)

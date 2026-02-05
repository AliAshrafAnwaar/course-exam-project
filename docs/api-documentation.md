# Course Exam Management System - API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Auth** ||||
| POST | /auth/register | Register new user | No |
| POST | /auth/login | User login | No |
| POST | /auth/logout | User logout | Yes |
| GET | /auth/me | Get current user | Yes |
| **Courses** ||||
| GET | /courses | List all courses | Yes |
| GET | /courses/:id | Get course details | Yes |
| POST | /courses | Create course | Yes |
| PUT | /courses/:id | Update course | Yes |
| DELETE | /courses/:id | Delete course | Yes |
| **Chapters** ||||
| GET | /courses/:courseId/chapters | List chapters | Yes |
| GET | /chapters/:id | Get chapter details | Yes |
| POST | /courses/:courseId/chapters | Create chapter | Yes |
| PUT | /chapters/:id | Update chapter | Yes |
| DELETE | /chapters/:id | Delete chapter | Yes |
| **Questions** ||||
| GET | /chapters/:chapterId/questions | List questions | Yes |
| GET | /questions/:id | Get question details | Yes |
| POST | /chapters/:chapterId/questions | Create question | Yes |
| PUT | /questions/:id | Update question | Yes |
| DELETE | /questions/:id | Delete question | Yes |
| **Exams** ||||
| GET | /courses/:courseId/exams | List exams | Yes |
| GET | /exams/:id | Get exam details | Yes |
| POST | /courses/:courseId/exams | Create exam | Yes |
| POST | /exams/:id/generate | Generate optimized exam | Yes |
| DELETE | /exams/:id | Delete exam | Yes |

---

## API Endpoints Detail

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "teacher1",
  "email": "teacher@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "teacher1",
      "email": "teacher@example.com",
      "fullName": "John Doe",
      "role": "teacher"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "teacher@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Courses

#### GET /courses
List all courses.

**Query Parameters:**
- `page` (int): Page number (default: 1)
- `limit` (int): Items per page (default: 10)
- `search` (string): Search by name

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "name": "Introduction to Programming",
        "description": "Beginner course",
        "totalChapters": 3,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

#### POST /courses
Create a new course.

**Request Body:**
```json
{
  "name": "Introduction to Programming",
  "description": "A beginner course",
  "totalChapters": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": 1,
      "name": "Introduction to Programming",
      "description": "A beginner course",
      "totalChapters": 3,
      "chapters": [
        {"id": 1, "name": "Chapter 1", "chapterNumber": 1},
        {"id": 2, "name": "Chapter 2", "chapterNumber": 2},
        {"id": 3, "name": "Chapter 3", "chapterNumber": 3}
      ]
    }
  }
}
```

---

### Questions

#### POST /chapters/:chapterId/questions
Create a new question.

**Request Body:**
```json
{
  "questionText": "What is a variable?",
  "choice1": "A storage location",
  "choice2": "A function",
  "choice3": "A loop",
  "correctChoice": 1,
  "difficulty": "simple",
  "objective": "reminding"
}
```

**Validation Rules:**
- `difficulty`: must be "simple" or "difficult"
- `objective`: must be "reminding", "understanding", or "creativity"
- `correctChoice`: must be 1, 2, or 3

**Response (201):**
```json
{
  "success": true,
  "data": {
    "question": {
      "id": 1,
      "chapterId": 1,
      "questionText": "What is a variable?",
      "choice1": "A storage location",
      "choice2": "A function",
      "choice3": "A loop",
      "correctAnswer": 1,
      "difficulty": "simple",
      "objective": "reminding",
      "createdBy": 1
    }
  }
}
```

---

### Exams

#### POST /courses/:courseId/exams
Create exam with requirements.

**Request Body:**
```json
{
  "name": "Midterm Exam",
  "chapterRequirements": [
    {"chapterId": 1, "questionCount": 4},
    {"chapterId": 2, "questionCount": 3},
    {"chapterId": 3, "questionCount": 3}
  ],
  "difficultyRequirements": {
    "simple": 5,
    "difficult": 5
  },
  "objectiveRequirements": {
    "reminding": 4,
    "understanding": 3,
    "creativity": 3
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "exam": {
      "id": 1,
      "name": "Midterm Exam",
      "courseId": 1,
      "createdBy": 1,
      "totalQuestions": 10,
      "reqSimpleCount": 5,
      "reqDifficultCount": 5,
      "reqRemindingCount": 4,
      "reqUnderstandingCount": 3,
      "reqCreativityCount": 3,
      "chapterRequirements": [...]
    }
  }
}
```

#### POST /exams/:id/generate
Generate optimized exam using algorithm.

**Request Body (optional):**
```json
{
  "algorithm": "genetic",
  "options": {
    "populationSize": 100,
    "generations": 50,
    "mutationRate": 0.1
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "exam": {
      "id": 1,
      "name": "Midterm Exam",
      "questions": [
        {
          "id": 1,
          "questionText": "What is a variable?",
          "choices": [...],
          "difficulty": "simple",
          "objective": "reminding",
          "chapter": "Variables and Data Types"
        }
      ],
      "statistics": {
        "totalQuestions": 10,
        "byChapter": {"1": 4, "2": 3, "3": 3},
        "byDifficulty": {"simple": 5, "difficult": 5},
        "byObjective": {"reminding": 4, "understanding": 3, "creativity": 3}
      },
      "fitness": 0.95,
      "algorithmUsed": "genetic"
    }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {"field": "email", "message": "Email is required"}
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |

---

## File Structure for Implementation

### Backend Files (to be created)

```
server/src/
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── chapterController.js
│   ├── questionController.js
│   └── examController.js
├── services/
│   ├── authService.js
│   ├── courseService.js
│   ├── chapterService.js
│   ├── questionService.js
│   ├── examService.js
│   └── optimizationService.js
├── routes/
│   ├── index.js
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   ├── chapterRoutes.js
│   ├── questionRoutes.js
│   └── examRoutes.js
├── middleware/
│   ├── auth.js
│   ├── authorize.js
│   ├── validation.js
│   └── errorHandler.js
├── models/
│   ├── index.js
│   ├── User.js
│   ├── Role.js
│   ├── Permission.js
│   ├── Course.js
│   ├── Chapter.js
│   ├── Question.js
│   ├── Exam.js
│   ├── ExamChapterRequirement.js
│   └── ExamQuestion.js
├── algorithms/
│   ├── geneticAlgorithm.js
│   └── fitnessFunction.js
└── utils/
    ├── validators.js
    └── helpers.js
```

### Frontend Files (to be created)

```
client/src/
├── services/
│   ├── endpoints.js
│   ├── authService.js
│   ├── courseService.js
│   ├── questionService.js
│   └── examService.js
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── CoursesPage.jsx
│   ├── CourseDetailPage.jsx
│   ├── QuestionsPage.jsx
│   ├── CreateExamPage.jsx
│   └── ViewExamPage.jsx
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   └── ui/
│       └── (shadcn components)
├── hooks/
│   ├── useAuth.js
│   ├── useCourses.js
│   └── useExams.js
└── context/
    └── AuthContext.jsx
```

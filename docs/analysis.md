# Course Exam Management System - Analysis Document

## 1. Project Overview

A system to design optimized exams for courses. Teachers can specify requirements (questions per chapter, difficulty distribution, objective distribution), and the system recommends the optimal exam using optimization algorithms.

## 2. Functional Requirements

### FR-1: Course Management
- FR-1.1: Create, read, update, delete courses
- FR-1.2: Define course name and number of chapters
- FR-1.3: List all courses with their chapters

### FR-2: Chapter Management
- FR-2.1: Create, read, update, delete chapters within a course
- FR-2.2: Each chapter must support exactly 12 questions
- FR-2.3: Chapters are numbered sequentially within a course

### FR-3: Question Management
- FR-3.1: Create, read, update, delete questions
- FR-3.2: Each question has exactly 3 choices (one correct)
- FR-3.3: Each question has a difficulty level: `simple` or `difficult`
- FR-3.4: Each question has an objective: `reminding`, `understanding`, or `creativity`
- FR-3.5: Questions are assigned to chapters
- FR-3.6: Filter questions by chapter, difficulty, objective

### FR-4: Exam Generation
- FR-4.1: Create exam with requirements:
  - Total number of questions
  - Questions per chapter
  - Questions per difficulty level
  - Questions per objective type
- FR-4.2: System generates optimized exam using Genetic Algorithm
- FR-4.3: Fallback to Greedy Algorithm if needed
- FR-4.4: View generated exam with selected questions
- FR-4.5: Save and retrieve exams

### FR-5: User Management
- FR-5.1: User registration and authentication
- FR-5.2: Role-based access control (Admin, Teacher, Student)
- FR-5.3: Permission management per role

## 3. Non-Functional Requirements

### NFR-1: Performance
- NFR-1.1: Exam generation should complete within 5 seconds
- NFR-1.2: API response time < 500ms for standard operations

### NFR-2: Security
- NFR-2.1: JWT-based authentication
- NFR-2.2: Password hashing with bcrypt
- NFR-2.3: Role-based authorization
- NFR-2.4: Input validation on all endpoints

### NFR-3: Scalability
- NFR-3.1: Support for multiple courses and exams
- NFR-3.2: Modular architecture for easy extension

### NFR-4: Usability
- NFR-4.1: Responsive UI design
- NFR-4.2: Clear error messages
- NFR-4.3: Intuitive exam creation interface

### NFR-5: Maintainability
- NFR-5.1: MVC architecture
- NFR-5.2: Service layer for business logic
- NFR-5.3: Comprehensive API documentation

## 4. Constraints

- Database: PostgreSQL
- Backend: Node.js with Express
- Frontend: React with shadcn/ui
- Algorithm: Genetic Algorithm (primary), Greedy (fallback)

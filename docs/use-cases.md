# Course Exam Management System - Use Cases

## Actors

| Actor | Description |
|-------|-------------|
| Admin | System administrator with full access |
| Teacher | Creates courses, questions, and exams |
| Student | Views exams (future scope) |

---

## Use Case Diagrams

```
┌─────────────────────────────────────────────────────────────────┐
│                    Course Exam Management System                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐                                                   │
│  │  Admin   │──────┬──► UC-1: Manage Users                      │
│  └──────────┘      ├──► UC-2: Manage Roles & Permissions        │
│       │            └──► UC-3: View System Analytics             │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐                                                   │
│  │ Teacher  │──────┬──► UC-4: Manage Courses                    │
│  └──────────┘      ├──► UC-5: Manage Chapters                   │
│                    ├──► UC-6: Manage Questions                  │
│                    ├──► UC-7: Create Exam Requirements          │
│                    ├──► UC-8: Generate Optimized Exam           │
│                    └──► UC-9: View/Export Exam                  │
│                                                                 │
│  ┌──────────┐                                                   │
│  │ Student  │──────────► UC-10: View Exam (Future)              │
│  └──────────┘                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Use Case Descriptions

### UC-1: Manage Users
| Field | Description |
|-------|-------------|
| **Actor** | Admin |
| **Description** | Admin can create, view, update, and delete user accounts |
| **Preconditions** | Admin is authenticated |
| **Main Flow** | 1. Admin navigates to user management<br>2. Admin performs CRUD operations<br>3. System validates and saves changes |
| **Postconditions** | User data is updated in the system |

### UC-4: Manage Courses
| Field | Description |
|-------|-------------|
| **Actor** | Teacher |
| **Description** | Teacher creates and manages courses |
| **Preconditions** | Teacher is authenticated |
| **Main Flow** | 1. Teacher creates a new course<br>2. Teacher specifies name and chapter count<br>3. System creates course with empty chapters |
| **Postconditions** | Course exists with specified chapters |

### UC-5: Manage Chapters
| Field | Description |
|-------|-------------|
| **Actor** | Teacher |
| **Description** | Teacher manages chapters within a course |
| **Preconditions** | Course exists, Teacher is authenticated |
| **Main Flow** | 1. Teacher selects a course<br>2. Teacher adds/edits chapter details<br>3. System validates chapter has 12 questions capacity |
| **Postconditions** | Chapter is created/updated |

### UC-6: Manage Questions
| Field | Description |
|-------|-------------|
| **Actor** | Teacher |
| **Description** | Teacher creates and assigns questions to chapters |
| **Preconditions** | Chapter exists, Teacher is authenticated |
| **Main Flow** | 1. Teacher selects a chapter<br>2. Teacher creates question with 3 choices<br>3. Teacher sets difficulty and objective<br>4. System validates and saves |
| **Alternative Flow** | If chapter has 12 questions, warn before adding more |
| **Postconditions** | Question is assigned to chapter |

### UC-7: Create Exam Requirements
| Field | Description |
|-------|-------------|
| **Actor** | Teacher |
| **Description** | Teacher specifies exam requirements |
| **Preconditions** | Course with questions exists |
| **Main Flow** | 1. Teacher selects course<br>2. Teacher specifies questions per chapter<br>3. Teacher specifies difficulty distribution<br>4. Teacher specifies objective distribution<br>5. System validates requirements are achievable |
| **Postconditions** | Exam requirements are saved |

### UC-8: Generate Optimized Exam
| Field | Description |
|-------|-------------|
| **Actor** | Teacher |
| **Description** | System generates optimal exam based on requirements |
| **Preconditions** | Valid exam requirements exist |
| **Main Flow** | 1. Teacher triggers exam generation<br>2. System runs Genetic Algorithm<br>3. System evaluates fitness of solutions<br>4. System returns best exam |
| **Alternative Flow** | If GA fails, use Greedy Algorithm |
| **Postconditions** | Optimized exam is generated |

### UC-9: View/Export Exam
| Field | Description |
|-------|-------------|
| **Actor** | Teacher |
| **Description** | Teacher views and exports generated exam |
| **Preconditions** | Exam has been generated |
| **Main Flow** | 1. Teacher views exam questions<br>2. Teacher can see distribution stats<br>3. Teacher can export/print exam |
| **Postconditions** | Exam is displayed/exported |

---

## Activity Diagram: Exam Generation

```
┌─────────────────┐
│     Start       │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Select Course   │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Set Requirements│
│ - Per Chapter   │
│ - Difficulty    │
│ - Objective     │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Validate        │◄───────────────┐
│ Requirements    │                │
└────────┬────────┘                │
         ▼                         │
    ┌────────┐                     │
    │ Valid? │──No──► Adjust ──────┘
    └────┬───┘        Requirements
         │Yes
         ▼
┌─────────────────┐
│ Run Genetic     │
│ Algorithm       │
└────────┬────────┘
         ▼
    ┌────────┐
    │Success?│──No──► Run Greedy ──┐
    └────┬───┘        Algorithm    │
         │Yes                      │
         ▼                         ▼
┌─────────────────┐    ┌─────────────────┐
│ Return Optimal  │    │ Return Best     │
│ Exam            │    │ Available Exam  │
└────────┬────────┘    └────────┬────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
            ┌─────────────┐
            │    End      │
            └─────────────┘
```

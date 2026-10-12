# 🎓 Student Task & Assignment Management System

A beginner-friendly, full-stack college Technical Training project built with **React.js, Java, Spring Boot, MySQL, and Maven**.

---

## 📌 Project Overview
The **Student Task & Assignment Management System** is designed to streamline academic workflows between teachers and students:
- **Teachers / Faculty**: Create, edit, delete, and manage assignments, view student submissions in real-time, and assign grades/feedback.
- **Students**: View assigned tasks, track deadlines, submit completed work with solution notes/links, and view received grades.
- **Student Records Management**: Full CRUD operations (Create, Read, Update, Delete) to manage student academic records.
- **Authentication**: Role-based Registration and Login for both Students and Faculty.

---

## 🛠️ Technology Stack
- **Frontend**: React.js 18, Vite, Axios, Custom Modern Responsive CSS (Inter typography, modal dialogs, status badges).
- **Backend**: Java 17+, Spring Boot 3.3.4, Spring Data JPA (Hibernate), Maven.
- **Database**: MySQL 8.0+ (InnoDB, Relational Schema with Foreign Keys).
- **Architecture**: 4-Tier Layered Architecture (`Controller` -> `Service` -> `Repository` -> `Entity`).

---

## 📁 Project Structure

```
tt project/
├── backend/
│   ├── pom.xml                                      # Maven dependencies
│   ├── src/main/java/com/example/studentmanagement/
│   │   ├── StudentTaskManagementApplication.java    # Spring Boot entry point
│   │   ├── config/
│   │   │   └── WebConfig.java                       # CORS configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java                  # /api/auth endpoints
│   │   │   ├── StudentController.java               # /api/students CRUD
│   │   │   ├── AssignmentController.java            # /api/assignments CRUD
│   │   │   └── SubmissionController.java            # /api/submissions endpoints
│   │   ├── entity/
│   │   │   ├── User.java                            # User table entity
│   │   │   ├── Student.java                         # Student record entity
│   │   │   ├── Assignment.java                      # Assignment entity
│   │   │   └── Submission.java                      # Task submission entity
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── StudentRepository.java
│   │   │   ├── AssignmentRepository.java
│   │   │   └── SubmissionRepository.java
│   │   └── service/
│   │       ├── UserService.java
│   │       ├── StudentService.java
│   │       ├── AssignmentService.java
│   │       └── SubmissionService.java
│   └── src/main/resources/
│       └── application.properties                   # MySQL connection & JPA config
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                                  # Routing & tab state
│       ├── main.jsx                                 # React root
│       ├── index.css                                # Design system & styling
│       ├── services/
│       │   └── api.js                               # Axios HTTP client
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── Modal.jsx
│       └── pages/
│           ├── Login.jsx                            # Login & demo shortcuts
│           ├── Register.jsx                         # Multi-role signup
│           ├── StudentDashboard.jsx                 # Task submission & grades
│           ├── TeacherDashboard.jsx                 # Assignment CRUD & grading
│           └── StudentManagement.jsx                # Student records CRUD
└── database_setup.sql                               # MySQL schema & initial sample data
```

---

## 🚀 Step-by-Step Setup & Run Instructions

### Step 1: Set Up MySQL Database
1. Open your MySQL client (MySQL Workbench, MySQL Command Line, or Terminal).
2. Execute the script provided in [`database_setup.sql`](file:///Users/kesaramaashritha/tt%20project/database_setup.sql):
   ```bash
   mysql -u root -p < database_setup.sql
   ```
   *Or open MySQL Workbench, load `database_setup.sql`, and click **Execute (⚡)**.*

3. Verify the database credentials in [`backend/src/main/resources/application.properties`](file:///Users/kesaramaashritha/tt%20project/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/student_task_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
   *(Replace `YOUR_MYSQL_PASSWORD` with your actual local MySQL password).*

---

### Step 2: Run the Spring Boot Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Build and run the Spring Boot application using Maven:
   ```bash
   mvn spring-boot:run
   ```
3. The backend server will start on: **`http://localhost:8080`**.

---

### Step 3: Run the React.js Frontend
1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser at: **`http://localhost:5173`**.

---

## 🔑 Default Demo Login Credentials

You can use the built-in quick-fill buttons or enter these credentials:

| Role | Email | Password | Features Accessible |
|---|---|---|---|
| **Teacher / Faculty** | `teacher@example.com` | `teacher123` | Create/Edit/Delete Assignments, Grade Student Submissions, Full Student CRUD |
| **Student** | `student@example.com` | `student123` | View Assignments, Submit Tasks, Track Submission Status & Grades |

---

## 📡 REST API Documentation

### 1. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register` — Register a new student or teacher.
- `POST /api/auth/login` — Authenticate and return user details.
- `GET /api/auth/users` — List all registered users.

### 2. Student Management Endpoints (`/api/students`)
- `GET /api/students` — Fetch all student records.
- `GET /api/students/{id}` — Fetch student by ID.
- `POST /api/students` — Add a new student.
- `PUT /api/students/{id}` — Update existing student details.
- `DELETE /api/students/{id}` — Delete student record by ID.

### 3. Assignment Endpoints (`/api/assignments`)
- `GET /api/assignments` — Fetch all active assignments (ordered by due date).
- `GET /api/assignments/{id}` — Fetch assignment by ID.
- `POST /api/assignments` — Create a new assignment.
- `PUT /api/assignments/{id}` — Edit an assignment.
- `DELETE /api/assignments/{id}` — Delete an assignment.

### 4. Submission Endpoints (`/api/submissions`)
- `POST /api/submissions/submit` — Submit or update task submission.
- `GET /api/submissions/student/{studentId}` — Get submissions for a student.
- `GET /api/submissions/assignment/{assignmentId}` — Get all submissions for an assignment.
- `PUT /api/submissions/{id}/grade` — Assign grade and feedback to a submission.

---

## 🔍 SQL Queries for Verification & Demonstration

You can run these queries directly in MySQL to demonstrate live database persistence:

```sql
USE student_task_management;

-- 1. View all registered accounts
SELECT id, name, email, role, created_at FROM users;

-- 2. View all student profiles
SELECT id, name, roll_number, course, department, semester, phone_number FROM students;

-- 3. View all assignments
SELECT id, title, subject, due_date, max_marks, created_by FROM assignments;

-- 4. View student submissions joined with assignment title
SELECT 
    s.id AS submission_id,
    a.title AS assignment_title,
    s.student_name,
    s.status,
    s.grade,
    s.submission_date
FROM submissions s
JOIN assignments a ON s.assignment_id = a.id;
```

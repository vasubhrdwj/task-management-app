Assignment: Build a Task Management Application

Objective: To learn and demonstrate skills in backend development using FastAPI, frontend development using React, relational databases, version control with Git, and basic GenAI integration.

Features to Implement

1\. User Management:

○ Backend

■ User registration and login (JWT-based authentication).

■ Role-based access control (Admin, Regular User).

○ Frontend

■ Create forms for user registration and login.

■ Use React Context or Redux for global state management to store user data and authentication tokens.

■ Implement conditional rendering to restrict access to pages/components based on user roles.

2\. Task Management:

○ Backend:

■ CRUD operations for tasks:

1\. Create a new task with fields: title, description, status, due_date, priority.

2\. Read tasks (view all tasks or a single task).

3\. Update a task (status, priority, or details).

4\. Delete a task.

5\. Filter and sort tasks by status, priority, and due_date.

○ Frontend:

■ Build a Task Dashboard that displays all tasks with:

1\. Pagination for large datasets.

2\. Filters and sorting options (e.g., dropdowns or buttons for status, priority, and due date).

3\. Create forms to handle the following:

4\. Add New Task

5\. Update Task Details

6\. Add a modal or popup for deleting a task with a confirmation step.

3\. Collaborative Features:

○ Create a Task Assignment Page:

■ Admins should be able to assign tasks to specific users using a dropdown menu populated with user data.

■ Display tasks grouped by the assigned user.

4\. Audit Log:

○ Maintain a log of actions (task creation, updates, deletions, etc.).

○ View audit logs as an Admin.

5\. Basic GenAI Feature:

○ Integrate with the OpenAI API to provide task suggestions:

○ Add a "Suggest Task" Button:

● Fetch the task suggestion from the backend using /suggest_task endpoint and display it in a styled component.

● Allow users to directly save the suggestion as a new task.

● Use the OpenAI library for this feature.

6\. Deployment:

○ Containerize the application using Docker.

○ Use Docker Compose to set up and run the backend, frontend, and database services.

7\. Unit Test Cases

○ Please add unit test cases for the backend tasks and the front end tasks.

Git and GitHub Requirements

● Create a private GitHub repository for the project, and add the following users as collaborators

● Maintain clear commit messages following best practices.

● Ensure a detailed README.md with:

○ Project overview.

○ Setup and usage instructions.

○ How to contribute.

○ Deployment steps.

Tech Stack

● Backend: FastAPI

● Frontend: React (with a state management library like Redux or Context API)

● Database: PostgreSQL or MySQL

● GenAI: OpenAI Python library (openai)

● Other Tools:

○ SQLAlchemy (ORM for FastAPI)

○ Alembic (database migrations)

○ Axios (or Fetch API for React HTTP calls)

○ Docker and Docker Compose

Requirements

1\. FastAPI Backend:

○ Implement RESTful API endpoints for all features.

○ Secure endpoints with JWT authentication.

○ Add a /suggest_task endpoint that interacts with the OpenAI API.

2\. Database:

○ Design a relational database schema with tables for Users, Tasks, and AuditLogs.

3\. React Frontend:

○ Build responsive UI components for all features.

○ Implement a "Suggest Task" button that triggers the /suggest_task endpoint and displays the generated suggestion.

4\. GitHub:

○ Follow Git best practices and maintain a clean commit history.

○ Ensure the project is documented and has clear setup instructions.

5\. Docker Deployment:

○ Create a Dockerfile for both the backend and frontend.

○ Use Docker Compose to:

■ Set up the backend, frontend, and database as services.

■ Ensure proper networking between services.

Deliverables

1\. GitHub Repository:

○ Fully functional and publicly accessible repository with proper Git practices.

○ README with setup and deployment instructions.

2\. Dockerized Application:

○ Docker and Docker Compose configuration for running the application locally.

3\. Presentation:

○ Demonstrate the application.

○ Share key learnings and challenges faced.

Evaluation Criteria

● Functional and feature-complete application.

● Code quality, documentation, and adherence to best practices.

● Proper Git usage and repository management.

● Successful Dockerized deployment.

● Integration of the OpenAI API.

React Best Practices to Enforce

Component Design:

1\. Use functional components

2\. Follow the "Separation of Concerns" principle: break components into smaller, reusable pieces.

State Management:

1\. Use React Context API or Redux for global state management (e.g., for user authentication and tasks).

2\. Keep local state within individual components where appropriate.

Hooks:

1\. useState: should be used to manage local state

2\. useEffect: should be used to manage api side effects

3\. useReducer: for managing complex state transitions like sorting and filtering

Prop Drilling:

1\. Need to avoid excessive prop drilling and use either Context API or Redux

Error Handling:

1\. Graceful handling of UI exceptions

2\. Bonus: Using Error Boundaries

Performance Optimisations:

1\. Should avoid excessive re rendering of components by making use of react memo or any other such optimising techniques.

2\. Lazy load with suspense when loading long lists

3\. Using pagination and infinite scroll effectively on all tables and grids

Styling:

1\. Make lesser use of global styled css and more of component based style sheets

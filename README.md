### **Node-And-Database-Task-Manager**

**Overview:**
Welcome to the Node-And-Database-Task-Manager challenge! This challenge builds upon the previous "My Task Manager - Terminal" project. Your mission is to enhance the task manager by integrating it with a database (SQLite3 or MariaDB) to store tasks persistently.

This challenge will allow you to solidify your understanding of working with databases, file I/O, and Node.js. The challenge is designed to test your ability to combine different areas of knowledge into a fully functional application.

**Part One: Setting Up the Database**

Before diving into the code, set up a database to store your tasks.

1. **Choose Your Database:**
  - **SQLite3:** Lightweight and serverless, good for this type of local application.
  - **MariaDB:** A more robust, server-based solution, but also an excellent choice for learning.

2. **Design the Database Schema:**
  - Create a table called `tasks` with the following columns:
    - `id` (Primary Key): Auto-incrementing unique identifier for each task.
    - `description`: A text field containing the task description.
    - `status`: A string field that can be either "pending" or "done".
    - `created_at`: A timestamp that stores when the task was created.
    - `updated_at`: A timestamp that stores when the task was last updated.

3. **Database Initialization Script:**
  - Write a script to initialize your database schema. This script should create the `tasks` table if it doesn't exist.

**Part Two: Extending the Task Manager**

Now, modify your task manager to work with your chosen database.

1. **Database Integration:**
  - Replace any in-memory task management logic with database operations (CRUD). Use SQL queries to interact with the database.
  - When the application starts, it should connect to the database and prepare it for operations.

2. **Task Management Functions:**
  - **View Tasks:** Query the database to list all tasks, displaying their ID, description, and status.
  - **Add Task:** Insert a new task into the database. Assign the status as "pending" by default.
  - **Delete Task:** Delete a task from the database using its ID.
  - **Mark Task as Done:** Update the status of a task to "done" using its ID.

3. **User Interface:**
  - Maintain the same terminal-based interface where the user is presented with options to manage tasks. After each action, return the user to the main menu.

**Part Three: Advanced Features (Bonus)**

Enhance your task manager with the following additional features:

1. **Task Filtering:**
  - Add a menu option to filter tasks by status ("pending" or "done").
  - Implement the filtering logic using SQL queries.

2. **Task Search:**
  - Add a menu option that allows users to search for tasks by keyword in their descriptions.
  - Use SQL `LIKE` queries to implement this feature.

3. **Task Sorting:**
  - Add options to sort tasks by creation date or status.
  - Implement sorting using SQL `ORDER BY` clauses.

4. **Task Prioritization:**
  - Add a column `priority` to the `tasks` table.
  - Implement task prioritization by allowing users to set and view the priority of tasks.
  - Sort tasks by priority and status when displaying them.

**Part Four: Persisting Data with JSON (Alternative/Complementary)**

For those who wish to explore file I/O alongside databases:

1. **Save to JSON:**
  - Implement a feature that exports the current tasks to a JSON file. This can be done at regular intervals, upon certain actions, or when exiting the task manager.

2. **Load from JSON:**
  - Implement a feature that imports tasks from a JSON file into the database. This could be useful for restoring a previous state or migrating data.

**Part Five: Error Handling & Validation**

1. **Input Validation:**
  - Validate user inputs, ensuring that task descriptions are not empty, IDs are valid integers, etc.
  - Handle cases where the user tries to interact with a non-existent task.

2. **Error Handling:**
  - Implement robust error handling for database operations (e.g., handling connection failures, query errors).
  - Ensure the application doesn't crash and provides meaningful feedback to the user in case of errors.

---

### **Bonus Challenges:**

- **Task Tagging:** Implement a tagging system where tasks can have one or more tags. Allow filtering tasks by tags.
- **Task Reminders:** Implement a feature to set reminders for tasks, and notify the user in the terminal when a task is due.
- **Multi-user Support:** Extend the application to support multiple users, each with their own task list.
- **Task Import/Export:** Implement features to import tasks from and export tasks to different formats (e.g., CSV, JSON).
- **CLI Enhancements:** Add colors, animations, or even sound effects to make the terminal experience more engaging.

---

### **Deliverables:**

- A working terminal-based task manager that uses a database to store tasks.
- A `README.md` file with instructions on how to set up and run your application, including database setup.
- Bonus: Include any additional features you've implemented, with instructions on how to use them.

### **Submission:**

Push your code to a GitHub repository and share the link.

---

This challenge not only reinforces your knowledge of Node.js and terminal-based applications but also introduces you to database integration and management, which are critical skills in software development. Good luck, and have fun!

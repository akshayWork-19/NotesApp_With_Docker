# NoteKeeper

A simple, containerized note-taking application.

> [!NOTE]
> 🚀 **Learning Docker**: This project is part of my journey to learn and master Docker containerization!

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js (Express)
- **Database/Storage**: In-memory (currently)
- **Containerization**: Docker & Docker Compose
- **Server**: Nginx (serving frontend & reverse proxy)

## 🐳 Running the Project

1. Ensure you have Docker and Docker Compose installed.
2. Clone the repository.
3. Run the application:
   ```bash
   docker-compose up --build
   ```
4. Open your browser:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **API Endpoint**: [http://localhost:3000/api/notes](http://localhost:3000/api/notes)

## 📁 Project Structure

- `frontend/`: React application + Nginx configuration
- `backend/`: Node.js Express server
- `docker-compose.yml`: Multi-container orchestration

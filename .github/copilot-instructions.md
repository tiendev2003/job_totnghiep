# Copilot Instructions for Hệ thống Việc Làm IT

## Project Overview
This project is an IT job platform connecting candidates, recruiters, AI system, administrators, and visitors. The main technologies are ReactJS (with Redux and React Router) for frontend, NodeJS (Express) for backend, and Python (Machine Learning) for AI modules.

## Coding Guidelines
- Use clear, descriptive variable and function names in English.
- Follow best practices for ReactJS (functional components, hooks, Redux for state management, React Router for navigation).
- Backend code should be modular, using Express routers and middleware.
- AI scripts should be organized and documented, using Python standards (PEP8).
- Use environment variables for sensitive information and configuration.
- Write comments for complex logic and public functions.
- Prefer async/await for asynchronous code in NodeJS.
- Use .env files for configuration in both frontend and backend.

## Folder Structure
- `/frontend`: ReactJS app (Redux, Router)
- `/backend`: NodeJS Express API
- `/ai`: Python ML scripts/models
- `/image.png`: Use case diagram
- `/README.md`: Project documentation

## Commit Message Convention
- Use clear, concise English commit messages.
- Prefix with type: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

## Pull Request Guidelines
- Describe changes clearly.
- Reference related issues if any.
- Ensure code passes lint and tests before submitting.

## Code Review
- Check for code clarity, maintainability, and security.
- Ensure new features are covered by tests if possible.

## AI Integration
- Python scripts in `/ai` should expose REST endpoints or be callable from backend if needed.
- Document model usage and input/output formats.

## Environment & Setup
- Use `.env` files for configuration.
- Document setup steps in README.md.

## License
- Specify license in README.md and main source files if required.

---
This file is for GitHub Copilot and contributors to follow consistent standards and maximize code quality for this project.

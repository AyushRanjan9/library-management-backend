# Library Management API

A RESTful API for managing library books, users, and fines with comprehensive Swagger documentation.

## Features

- 📚 Book management (CRUD operations)
- 👥 User fine tracking
- 📖 Detailed book information with author, publisher, and category details
- 📋 Interactive API documentation with Swagger UI
- 🗄️ SQLite in-memory database (no external database setup required)
- 🔒 CORS enabled for cross-origin requests
- 🚀 Auto-initialized with sample data on startup

## API Endpoints

- `GET /api/books` - Get all books
- `POST /api/books` - Add a new book
- `GET /api/books/:bookId` - Get book details by ID
- `GET /api/fines/:userId` - Get total fines for a user

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Git](https://git-scm.com/)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd library-management-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

```bash
npm start
```

The server will start on `http://localhost:3000`

**Note**: The application uses an in-memory SQLite database that is automatically initialized with sample data when the server starts. No external database setup is required!

## API Documentation

Once the server is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:3000/api-docs

## Sample Data

The application comes pre-loaded with sample data including:

### Books
- The Great Gatsby (F. Scott Fitzgerald)
- To Kill a Mockingbird (Harper Lee)
- 1984 (George Orwell)
- Harry Potter and the Sorcerer's Stone (J.K. Rowling)
- The Hobbit (J.R.R. Tolkien)

### Users
- John Doe, Jane Smith, Bob Johnson, Alice Brown

### Sample Fines
- Various fine amounts for different users

## Git Commands

Here are the essential Git commands for working with this project:

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd library-management-backend
```

### Daily Development Workflow
```bash
# Check current status
git status

# Add all changes to staging
git add .

# Add specific files
git add filename.js

# Commit changes with a message
git commit -m "Add new feature: user authentication"

# Push changes to remote repository
git push origin main

# Pull latest changes from remote
git pull origin main
```

### Branch Management
```bash
# Create and switch to a new branch
git checkout -b feature/new-feature

# Switch between branches
git checkout main
git checkout feature/new-feature

# List all branches
git branch

# Delete a branch
git branch -d feature/old-feature
```

### Viewing History
```bash
# View commit history
git log

# View commit history in one line
git log --oneline

# View changes in a specific commit
git show <commit-hash>
```

## NPM Commands

### Development
```bash
# Install dependencies
npm install

# Start the application
npm start

# Install a specific package
npm install package-name

# Install development dependencies
npm install --save-dev package-name
```

### Package Management
```bash
# Update packages
npm update

# Check for outdated packages
npm outdated

# Audit packages for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

## Project Structure

```
library-management-backend/
├── config/
│   └── db.config.js          # SQLite database configuration with auto-initialization
├── controllers/
│   └── library.controller.js # API controllers
├── routes/
│   └── library.routes.js     # API routes with Swagger docs
├── node_modules/             # Dependencies (gitignored)
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies and scripts
├── package-lock.json        # Locked dependency versions
├── README.md               # This file
├── server.js               # Express server setup
└── swagger.js              # Swagger configuration
```

## API Usage Examples

### Get All Books
```bash
curl -X GET http://localhost:3000/api/books
```

### Add a New Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author_id": 1,
    "publisher_id": 1,
    "category_id": 1,
    "isbn": "978-0743273565",
    "publication_year": 1925,
    "copies_available": 5
  }'
```

### Get Book Details
```bash
curl -X GET http://localhost:3000/api/books/1
```

### Get User Fines
```bash
curl -X GET http://localhost:3000/api/fines/1
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   ```

2. **Module not found errors**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Database errors**
   - The application uses an in-memory database that resets on each restart
   - All data is automatically recreated with sample data on startup
   - No external database configuration is needed

### Logs

Check the console output for detailed error messages and server logs. You should see:
- "Connected to in-memory SQLite database"
- "Database initialized with sample data"

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@library.com or create an issue in the repository. 
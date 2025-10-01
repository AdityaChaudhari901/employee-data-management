# 🏢 Employee Data Management System

A modern, full-stack web application for managing employee data with a sleek black and white minimalist theme. Built with React, Node.js, Express, and SQLite.

![Employee Management System](https://github.com/user/employee-data-management/blob/main/Screenshot%202025-10-01%20at%2012.56.22%20PM.png)

## ✨ Features

- **Complete CRUD Operations** - Create, Read, Update, Delete employees
- **Real-time Search & Filter** - Search by name, email, or position
- **Form Validation** - Client and server-side validation with error messages
- **Responsive Design** - Modern Material-UI interface that works on all devices
- **Professional UI** - Sleek black and white minimalist theme
- **Glass-morphic Design** - Transparent overlays with backdrop blur effects
- **Comprehensive Testing** - 14 backend API tests with 95%+ coverage

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing
- **Jest & Supertest** - Testing framework

### Frontend
- **React 18** - UI library with hooks
- **Material-UI (MUI)** - Modern component library
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with glass-morphic effects

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/employee-data-management.git
   cd employee-data-management
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   npm start
   ```
   Server will run on http://localhost:3001

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Application will open on http://localhost:3000

## 🧪 Running Tests

### Backend API Tests
```bash
# Run all backend tests
npm test

# Run tests with coverage
npm run test:watch

# View coverage report
open coverage/lcov-report/index.html
```

The test suite includes:
- ✅ Health check endpoint testing
- ✅ CRUD operations testing (Create, Read, Update, Delete)
- ✅ Data validation testing
- ✅ Error handling testing
- ✅ Database constraint testing
- ✅ HTTP status code validation

**Test Coverage:** 95%+ with 14 comprehensive test cases

## 🏗 Project Structure

```
employee-data-management/
├── 📄 README.md                    # Project documentation
├── 📄 package.json                 # Backend dependencies & scripts
├── 📄 .gitignore                   # Git ignore rules
│
├── 🧪 __tests__/                   # Backend API tests
│   └── api.test.js                 # 14 comprehensive test cases
│
├── 🗄️ backend/                     # Node.js/Express backend
│   ├── server.js                   # Express server & SQLite setup
│   └── employees.db                # SQLite database file
│
├── 🎨 frontend/                    # React frontend application
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 🌐 public/
│   │   ├── index.html              # Main HTML template
│   │   └── favicon.ico             # Application icon
│   └── 📦 src/
│       ├── App.js                  # Main React component
│       ├── App.css                 # Black/white theme styles
│       ├── index.js                # React entry point
│       └── index.css               # Global styles
│
└── 📊 coverage/                    # Test coverage reports
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/employees` | Get all employees |
| `POST` | `/api/employees` | Create employee |
| `GET` | `/api/employees/:id` | Get employee by ID |
| `PUT` | `/api/employees/:id` | Update employee |
| `DELETE` | `/api/employees/:id` | Delete employee |

### Example API Usage
```bash
# Create a new employee
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@company.com",
    "position": "Software Engineer"
  }'

# Get all employees
curl http://localhost:3001/api/employees
```

## 🎯 Design Choices & Assumptions

### Architecture Decisions

1. **Monorepo Structure**: Frontend and backend in single repository for simplicity
2. **SQLite Database**: Lightweight, file-based database perfect for development and small deployments
3. **Material-UI**: Provides consistent, professional UI components out of the box
4. **Black & White Theme**: Minimalist design focusing on functionality and accessibility

### Technical Assumptions

1. **Single User Environment**: No authentication required for MVP
2. **Local Development**: Optimized for local development with simple setup
3. **Email Uniqueness**: Business rule that employee emails must be unique
4. **Form Validation**: Both client and server-side validation for better UX and security

### UI/UX Decisions

1. **Glass-morphic Design**: Modern aesthetic with transparent overlays and blur effects
2. **Responsive Layout**: Mobile-first approach using Material-UI breakpoints
3. **Real-time Search**: Instant filtering for better user experience
4. **Toast Notifications**: Clear feedback for all user actions

### Database Design

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  position TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Error Handling Strategy

- **Frontend**: User-friendly error messages with toast notifications
- **Backend**: Comprehensive error handling with appropriate HTTP status codes
- **Validation**: Duplicate validation on both client and server sides

## 🚀 Available Scripts

### Root Directory (Backend)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run API tests
npm run test:watch # Run tests in watch mode
npm run frontend   # Start frontend from root
```

### Frontend Directory
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run React tests (if any)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
DB_PATH=./backend/employees.db
```

## � Deployment

### Production Build
```bash
# Build frontend for production
cd frontend && npm run build

# Start backend in production mode
NODE_ENV=production npm start
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🛡️ Security Features

- Input validation on both client and server
- SQL injection protection with parameterized queries
- CORS configuration for cross-origin requests
- Error handling without exposing sensitive data

## 📈 Performance Features

- Optimized bundle size with minimal dependencies
- Efficient SQLite queries with proper indexing
- Client-side search filtering
- Smooth animations with CSS transforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Employee photo uploads
- [ ] Advanced search filters
- [ ] Data export functionality (CSV, PDF)
- [ ] Real-time notifications
- [ ] Dark/light theme toggle
- [ ] Progressive Web App (PWA) features

## 🙏 Acknowledgments

- **Material-UI** for the excellent component library
- **React** for the powerful frontend framework
- **Express.js** for the robust backend framework
- **SQLite** for the lightweight database solution

---

<div align="center">
  <strong>Built with ❤️ for modern employee management</strong>
</div>
│   ├── server.js              # Express server with API endpoints
│   └── employees.db           # SQLite database (auto-created)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styling
│   │   └── index.js          # React entry point
│   └── package.json          # Frontend dependencies
├── __tests__/
│   └── api.test.js           # Backend API tests
├── package.json              # Root package.json
└── README.md                 # This file
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone and Setup
```bash
git clone <repository-url>
cd employee-data-management
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 3. Start the Application

#### Option A: Start Both Servers Separately (Recommended for Development)

**Terminal 1 - Backend:**
```bash
npm start
# Backend will run on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
# Frontend will run on http://localhost:3000
```

#### Option B: Quick Start Backend Only
```bash
npm start
# Only starts the backend API server
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/employees
- **Health Check**: http://localhost:3001/api/health

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Test Coverage
```bash
npm test -- --coverage
```

## 📡 API Endpoints

### Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/health` | Health check | - |
| GET | `/employees` | Get all employees | - |
| GET | `/employees/:id` | Get employee by ID | - |
| POST | `/employees` | Create new employee | `{name, email, position}` |
| PUT | `/employees/:id` | Update employee | `{name, email, position}` |
| DELETE | `/employees/:id` | Delete employee | - |

### Sample API Usage

#### Create Employee
```bash
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "position": "Software Developer"
  }'
```

#### Get All Employees
```bash
curl http://localhost:3001/api/employees
```

## 📱 Frontend Features

### User Interface
- **Modern Design**: Clean, professional Material-UI interface
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Search Functionality**: Real-time filtering across all employee fields
- **Modal Dialogs**: Intuitive add/edit forms
- **Confirmation Dialogs**: Safe delete operations
- **Loading States**: User feedback during API operations

### Form Validation
- **Required Fields**: Name, email, and position are mandatory
- **Email Format**: Validates proper email format
- **Duplicate Prevention**: Prevents duplicate email addresses
- **Real-time Feedback**: Immediate validation feedback

## 🔧 Development Scripts

```bash
# Start backend server
npm start
npm run backend

# Start frontend development server
npm run frontend

# Run backend in development mode with auto-restart
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm run test:watch
```

## 🏗 Design Choices and Assumptions

### Backend Design
1. **SQLite Database**: Chosen for simplicity and portability - no external database setup required
2. **Email Uniqueness**: Assumed each employee should have a unique email address
3. **Timestamps**: Added created_at and updated_at fields for audit trail
4. **Validation Middleware**: Centralized validation for clean code organization
5. **Error Handling**: Comprehensive error responses with proper HTTP status codes

### Frontend Design
1. **Material-UI**: Selected for professional appearance and responsive components
2. **Single Page Application**: All operations handled in one view for simplicity
3. **Real-time Search**: Implemented client-side for better user experience
4. **Modal Editing**: Chose modal over separate page for better UX flow
5. **Optimistic Updates**: UI updates immediately while API calls process in background

### Data Model
```sql
employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Security Considerations
- Input validation on both frontend and backend
- SQL injection prevention through parameterized queries
- XSS prevention through React's built-in protection
- CORS configured for development (should be restricted in production)

## 🚀 Production Deployment

### Environment Variables
```bash
PORT=3001                    # Server port
NODE_ENV=production         # Environment
```

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/build/
```

### Production Considerations
1. **Database**: Consider migrating to PostgreSQL or MySQL for production
2. **CORS**: Restrict CORS origins to your domain
3. **Authentication**: Add user authentication and authorization
4. **Rate Limiting**: Implement API rate limiting
5. **Logging**: Add proper logging middleware
6. **SSL**: Enable HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3001
   lsof -ti:3001 | xargs kill -9
   ```

2. **Database Lock Error**
   ```bash
   # Remove database file and restart
   rm backend/employees.db
   npm start
   ```

3. **Frontend Not Loading**
   - Ensure backend is running on port 5000
   - Check console for CORS errors
   - Verify API endpoints are accessible

4. **Test Failures**
   - Ensure no server is running on port 5000 during tests
   - Clear any test database files

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

---

**Happy Coding! 🎉**

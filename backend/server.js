const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const dbPath = path.join(__dirname, 'employees.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database.');
});

// Create employees table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  position TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Employees table ready.');
  }
});

// Validation middleware
const validateEmployee = (req, res, next) => {
  const { name, email, position } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (!position || !position.trim()) {
    return res.status(400).json({ error: 'Position is required' });
  }
  
  next();
};

// CRUD Endpoints

// GET all employees
app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching employees:', err.message);
      return res.status(500).json({ error: 'Failed to fetch employees' });
    }
    res.json(rows);
  });
});

// GET employee by ID
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching employee:', err.message);
      return res.status(500).json({ error: 'Failed to fetch employee' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(row);
  });
});

// POST new employee
app.post('/api/employees', validateEmployee, (req, res) => {
  const { name, email, position } = req.body;
  
  db.run(
    'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
    [name.trim(), email.trim(), position.trim()],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Error creating employee:', err.message);
        return res.status(500).json({ error: 'Failed to create employee' });
      }
      
      // Return the created employee
      db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error('Error fetching created employee:', err.message);
          return res.status(500).json({ error: 'Employee created but failed to fetch' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// PUT update employee
app.put('/api/employees/:id', validateEmployee, (req, res) => {
  const { id } = req.params;
  const { name, email, position } = req.body;
  
  db.run(
    'UPDATE employees SET name = ?, email = ?, position = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name.trim(), email.trim(), position.trim(), id],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Error updating employee:', err.message);
        return res.status(500).json({ error: 'Failed to update employee' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      // Return the updated employee
      db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching updated employee:', err.message);
          return res.status(500).json({ error: 'Employee updated but failed to fetch' });
        }
        res.json(row);
      });
    }
  );
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Error deleting employee:', err.message);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully', deletedId: id });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API base URL: http://localhost:${PORT}/api/employees`);
});

module.exports = app;

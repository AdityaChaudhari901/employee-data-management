const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Create a separate test server instance
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test database path
const testDbPath = path.join(__dirname, 'test_employees.db');
let db;

const initTestApp = () => {
  // Initialize test SQLite DB
  db = new sqlite3.Database(testDbPath);
  
  // Create employees table
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    position TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
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
  
  // Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  app.get('/api/employees', (req, res) => {
    db.all('SELECT * FROM employees ORDER BY created_at DESC', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch employees' });
      }
      res.json(rows);
    });
  });
  
  app.get('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch employee' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(row);
    });
  });
  
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
          return res.status(500).json({ error: 'Failed to create employee' });
        }
        
        db.get('SELECT * FROM employees WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            return res.status(500).json({ error: 'Employee created but failed to fetch' });
          }
          res.status(201).json(row);
        });
      }
    );
  });
  
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
          return res.status(500).json({ error: 'Failed to update employee' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        
        db.get('SELECT * FROM employees WHERE id = ?', [id], (err, row) => {
          if (err) {
            return res.status(500).json({ error: 'Employee updated but failed to fetch' });
          }
          res.json(row);
        });
      }
    );
  });
  
  app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM employees WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete employee' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      
      res.json({ message: 'Employee deleted successfully', deletedId: id });
    });
  });
  
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });
};

describe('Employee API', () => {
  beforeAll(() => {
    initTestApp();
  });

  beforeEach((done) => {
    // Clean up test database before each test
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    // Reinitialize database
    db = new sqlite3.Database(testDbPath);
    db.run(`CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      position TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, done);
  });

  afterAll((done) => {
    // Clean up test database after all tests
    if (db) {
      db.close(() => {
        if (fs.existsSync(testDbPath)) {
          fs.unlinkSync(testDbPath);
        }
        done();
      });
    } else {
      if (fs.existsSync(testDbPath)) {
        fs.unlinkSync(testDbPath);
      }
      done();
    }
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(res.body.status).toBe('OK');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/employees', () => {
    it('should return empty array initially', async () => {
      const res = await request(app)
        .get('/api/employees')
        .expect(200);
      
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee', async () => {
      const newEmployee = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Developer'
      };

      const res = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      expect(res.body.name).toBe(newEmployee.name);
      expect(res.body.email).toBe(newEmployee.email);
      expect(res.body.position).toBe(newEmployee.position);
      expect(res.body.id).toBeDefined();
      expect(res.body.created_at).toBeDefined();
    });

    it('should return 400 for missing name', async () => {
      const invalidEmployee = {
        email: 'john.doe@example.com',
        position: 'Software Developer'
      };

      const res = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);

      expect(res.body.error).toBe('Name is required');
    });

    it('should return 400 for invalid email', async () => {
      const invalidEmployee = {
        name: 'John Doe',
        email: 'invalid-email',
        position: 'Software Developer'
      };

      const res = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);

      expect(res.body.error).toBe('Invalid email format');
    });

    it('should return 400 for missing position', async () => {
      const invalidEmployee = {
        name: 'John Doe',
        email: 'john.doe@example.com'
      };

      const res = await request(app)
        .post('/api/employees')
        .send(invalidEmployee)
        .expect(400);

      expect(res.body.error).toBe('Position is required');
    });

    it('should return 400 for duplicate email', async () => {
      const employee = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Developer'
      };

      // Create first employee
      await request(app)
        .post('/api/employees')
        .send(employee)
        .expect(201);

      // Try to create another with same email
      const duplicateEmployee = {
        name: 'Jane Doe',
        email: 'john.doe@example.com',
        position: 'Designer'
      };

      const res = await request(app)
        .post('/api/employees')
        .send(duplicateEmployee)
        .expect(400);

      expect(res.body.error).toBe('Email already exists');
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return employee by id', async () => {
      const newEmployee = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Developer'
      };

      const createRes = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      const res = await request(app)
        .get(`/api/employees/${createRes.body.id}`)
        .expect(200);

      expect(res.body.id).toBe(createRes.body.id);
      expect(res.body.name).toBe(newEmployee.name);
      expect(res.body.email).toBe(newEmployee.email);
      expect(res.body.position).toBe(newEmployee.position);
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .get('/api/employees/999')
        .expect(404);

      expect(res.body.error).toBe('Employee not found');
    });
  });

  describe('PUT /api/employees/:id', () => {
    it('should update an existing employee', async () => {
      const newEmployee = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Developer'
      };

      const createRes = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      const updatedData = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        position: 'Senior Software Developer'
      };

      const res = await request(app)
        .put(`/api/employees/${createRes.body.id}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.name).toBe(updatedData.name);
      expect(res.body.email).toBe(updatedData.email);
      expect(res.body.position).toBe(updatedData.position);
      expect(res.body.updated_at).toBeDefined();
    });

    it('should return 404 for non-existent employee', async () => {
      const updatedData = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        position: 'Senior Software Developer'
      };

      const res = await request(app)
        .put('/api/employees/999')
        .send(updatedData)
        .expect(404);

      expect(res.body.error).toBe('Employee not found');
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an existing employee', async () => {
      const newEmployee = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Software Developer'
      };

      const createRes = await request(app)
        .post('/api/employees')
        .send(newEmployee)
        .expect(201);

      const res = await request(app)
        .delete(`/api/employees/${createRes.body.id}`)
        .expect(200);

      expect(res.body.message).toBe('Employee deleted successfully');
      expect(res.body.deletedId).toBe(createRes.body.id.toString());

      // Verify employee is deleted
      await request(app)
        .get(`/api/employees/${createRes.body.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent employee', async () => {
      const res = await request(app)
        .delete('/api/employees/999')
        .expect(404);

      expect(res.body.error).toBe('Employee not found');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const res = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(res.body.error).toBe('Endpoint not found');
    });
  });
});

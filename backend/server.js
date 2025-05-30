const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Change if you set a password
  database: 'myappdb',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Basic route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length > 0) {
        res.json({ success: true, user: results[0] });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

// Dashboard stats endpoint
app.get('/api/stats', (req, res) => {
  // Count clients
  db.query('SELECT COUNT(*) AS totalClients FROM clients', (err, clientResults) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    // Count private properties
    db.query('SELECT COUNT(*) AS privateCount FROM private_properties', (err, privateResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      // Count property projects
      db.query('SELECT COUNT(*) AS projectCount FROM property_projects', (err, projectResults) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Count agents
        db.query('SELECT COUNT(*) AS totalAgents FROM agents', (err, agentResults) => {
          if (err) return res.status(500).json({ error: 'Database error' });

          // Get total commission for the current month
          db.query(
            `SELECT IFNULL(SUM(gross_commission),0) AS totalCommission 
             FROM commissions 
             WHERE MONTH(date_disbursed) = MONTH(CURRENT_DATE()) 
               AND YEAR(date_disbursed) = YEAR(CURRENT_DATE())`,
            (err, commissionResults) => {
              if (err) return res.status(500).json({ error: 'Database error' });

              db.query(
                `SELECT 
                    IFNULL(SUM(CASE WHEN MONTH(rs_date) = MONTH(CURRENT_DATE()) AND YEAR(rs_date) = YEAR(CURRENT_DATE()) THEN tcp ELSE 0 END),0) AS totalSalesThisMonth,
                    IFNULL(SUM(CASE WHEN MONTH(rs_date) = MONTH(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) AND YEAR(rs_date) = YEAR(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH)) THEN tcp ELSE 0 END),0) AS totalSalesPrevMonth
                 FROM sales`,
                (err, salesResults) => {
                  if (err) return res.status(500).json({ error: 'Database error' });

                  const totalProperties = privateResults[0].privateCount + projectResults[0].projectCount;

                  res.json({
                    totalClients: clientResults[0].totalClients,
                    totalProperties: totalProperties,
                    totalSales: salesResults[0].totalSalesThisMonth, // <-- real-time sales this month
                    totalSalesPrevMonth: salesResults[0].totalSalesPrevMonth, // <-- previous month
                    totalAgents: agentResults[0].totalAgents,
                    totalCommission: commissionResults[0].totalCommission
                  });
                }
              );
            }
          );
        });
      });
    });
  });
});

// Fetch all clients
app.get('/api/clients', (req, res) => {
  const query = 'SELECT id, first_name, last_name, phone_number, email FROM clients';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching clients:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Fetch client details by ID
app.get('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM clients WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching client details:', err);
      res.status(500).json({ error: 'Database error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Client not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Add a new client
app.post('/api/clients', (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    email,
    gender,
    address,
    dob,
    job_details,
    monthly_income,
    source_of_funds,
    proof_of_billing = 0,
    tax_certificate = 0,
    birth_certificate = 0,
    marriage_contract = 0
  } = req.body;

  const query = `
    INSERT INTO clients (
      first_name, last_name, phone_number, email, gender, address, dob, job_details, monthly_income, source_of_funds,
      proof_of_billing, tax_certificate, birth_certificate, marriage_contract
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
     ;

  db.query(
    query,
    [
      first_name,
      last_name,
      phone_number,
      email,
      gender,
      address,
      dob,
      job_details,
      monthly_income,
      source_of_funds,
      proof_of_billing,
      tax_certificate,
      birth_certificate,
      marriage_contract
    ],
    (err, results) => {
      if (err) {
        console.error('Error adding client:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ message: 'Client added successfully' });
      }
    }
  );
});

// Update client details by ID
app.put('/api/clients/:id', (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    phone_number,
    email,
    gender,
    address,
    dob,
    job_details,
    monthly_income,
    source_of_funds,
    proof_of_billing = 0,
    tax_certificate = 0,
    birth_certificate = 0,
    marriage_contract = 0
  } = req.body;

  const query = `
    UPDATE clients
    SET first_name = ?, last_name = ?, phone_number = ?, email = ?, gender = ?, address = ?, dob = ?, job_details = ?, monthly_income = ?, source_of_funds = ?,
       proof_of_billing = ?, tax_certificate = ?, birth_certificate = ?, marriage_contract = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      first_name,
      last_name,
      phone_number,
      email,
      gender,
      address,
      dob,
      job_details,
      monthly_income,
      source_of_funds,
      proof_of_billing,
      tax_certificate,
      birth_certificate,
      marriage_contract,
      id
    ],
    (err, results) => {
      if (err) {
        console.error('Error updating client:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json({ message: 'Client updated successfully' });
      }
    }
  );
});

// Fetch all sales records
app.get('/api/sales', (req, res) => {
  db.query('SELECT * FROM sales', (err, results) => {
    if (err) {
      console.error('Error fetching sales:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Add a new sale
app.post('/api/sales', (req, res) => {
  const {
    rs_date,
    tcp,
    sales_manager,
    project_name,
    sales_person,
    total,
    buyer_name,
    other_project
  } = req.body;

  const query = `
    INSERT INTO sales (rs_date, tcp, sales_manager, project_name, sales_person, total, buyer_name, other_project)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [rs_date, tcp, sales_manager, project_name, sales_person, total, buyer_name, other_project || ''],
    (err, results) => {
      if (err) {
        console.error('Error adding sale:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
      } else {
        res.status(201).json({ message: 'Sale added successfully' });
      }
    }
  );
});

// ✅ Fetch all agent records
app.get('/api/agents', (req, res) => {
  db.query('SELECT * FROM agents', (err, results) => {
    if (err) {
      console.error('Error fetching agents:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

app.post('/api/agents', (req, res) => {
  const {
    last_name,
    first_name,
    middle_name,
    dob,
    address,
    civil_status,
    educational_attainment,
    position
  } = req.body;

  const query = `
    INSERT INTO agents (
      last_name, first_name, middle_name, dob, address, civil_status, educational_attainment, position
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [last_name, first_name, middle_name, dob, address, civil_status, educational_attainment, position],
    (err, results) => {
      if (err) {
        console.error('Error adding agent:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json({ message: 'Agent added successfully' });
      }
    }
  );
});

// Fetch agent details by ID
app.get('/api/agents/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM agents WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching agent details:', err);
      res.status(500).json({ error: 'Database error' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Agent not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Update a sale by ID
app.put('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  const {
    rs_date,
    tcp,
    sales_manager,
    project_name,
    sales_person,
    total,
    buyer_name,
    other_project
  } = req.body;

  const query = `
    UPDATE sales
    SET rs_date = ?, tcp = ?, sales_manager = ?, project_name = ?, sales_person = ?, total = ?, buyer_name = ?, other_project = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [rs_date, tcp, sales_manager, project_name, sales_person, total, buyer_name, other_project || '', id],
    (err, results) => {
      if (err) {
        console.error('Error updating sale:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
      } else {
        res.json({ message: 'Sale updated successfully' });
      }
    }
  );
});

// Delete a sale by ID
app.delete('/api/sales/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM sales WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting sale:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Sale not found' });
    } else {
      res.json({ message: 'Sale deleted successfully' });
    }
  });
});

// Update agent details by ID
app.put('/api/agents/:id', (req, res) => {
  const { id } = req.params;
  const {
    last_name,
    first_name,
    middle_name,
    dob,
    address,
    civil_status,
    educational_attainment,
    position
  } = req.body;

  const query = `
    UPDATE agents
    SET last_name = ?, first_name = ?, middle_name = ?, dob = ?, address = ?, civil_status = ?, educational_attainment = ?, position = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [last_name, first_name, middle_name, dob, address, civil_status, educational_attainment, position, id],
    (err, results) => {
      if (err) { 
        console.error('Error updating agent:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
      } else {
        res.json({ message: 'Agent updated successfully' });
      }
    }
  );
});

// Fetch all commissions
app.get('/api/commissions', (req, res) => {
  db.query('SELECT * FROM commissions', (err, results) => {
    if (err) {
      console.error('Error fetching commissions:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Add a new commission
app.post('/api/commissions', (req, res) => {
  const {
    sales_id, // Added
    property_no,
    buyer_name,
    sales_agent,
    gross_commission,
    net_commission,
    date_disbursed
  } = req.body;

  const query = `
    INSERT INTO commissions (sales_id, property_no, buyer_name, sales_agent, gross_commission, net_commission, date_disbursed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [sales_id, property_no, buyer_name, sales_agent, gross_commission, net_commission, date_disbursed],
    (err, results) => {
      if (err) {
        console.error('Error adding commission:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
      } else {
        res.status(201).json({ message: 'Commission added successfully', id: results.insertId });
      }
    }
  );
});

// Delete a commission by ID
app.delete('/api/commissions/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM commissions WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error deleting commission:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Commission not found' });
    } else {
      res.json({ message: 'Commission deleted successfully' });
    }
  });
});

// --- PRIVATE PROPERTIES ---
// Get all private properties
app.get('/api/private-properties', (req, res) => {
  db.query('SELECT * FROM private_properties', (err, results) => {
    if (err) {
      console.error('Error fetching private properties:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Add a private property
app.post('/api/private-properties', (req, res) => {
  const {
    ownership, owner_firstname, owner_lastname, price, model,
    location, lot_area, type, status, date_listed
  } = req.body;
  const query = `
    INSERT INTO private_properties
    (ownership, owner_firstname, owner_lastname, price, model, location, lot_area, type, status, date_listed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [ownership, owner_firstname, owner_lastname, price, model, location, lot_area, type, status, date_listed],
    (err, results) => {
      if (err) {
        console.error('Error adding private property:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
      } else {
        res.status(201).json({ message: 'Private property added', id: results.insertId });
      }
    }
  );
});

// Delete a private property
app.delete('/api/private-properties/:id', (req, res) => {
  db.query('DELETE FROM private_properties WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error deleting private property:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    } else {
      res.json({ message: 'Private property deleted' });
    }
  });
});

// --- PROPERTY PROJECTS ---
// Get all property projects
app.get('/api/property-projects', (req, res) => {
  db.query('SELECT * FROM property_projects', (err, results) => {
    if (err) {
      console.error('Error fetching property projects:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Add a property project
app.post('/api/property-projects', (req, res) => {
  console.log('Received:', req.body); // <-- Add this line

  const {
    ownership, owner_firstname, owner_lastname, price, model,
    location, lot_area, type, status, date_listed
  } = req.body;
  const query = `
    INSERT INTO property_projects
    (ownership, owner_firstname, owner_lastname, price, model, location, lot_area, type, status, date_listed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [ownership, owner_firstname, owner_lastname, price, model, location, lot_area, type, status, date_listed],
    (err, results) => {
      if (err) {
        console.error('Error adding property project:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
      } else {
        res.status(201).json({ message: 'Property project added', id: results.insertId });
      }
    }
  );
});

// Delete a property project
app.delete('/api/property-projects/:id', (req, res) => {
  db.query('DELETE FROM property_projects WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error deleting property project:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    } else {
      res.json({ message: 'Property project deleted' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

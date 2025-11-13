const express = require('express');
const cors = require('cors');
const db = require('./db');  // Import database connection

const app = express();
app.use(express.json());  // To parse JSON bodies
app.use(cors());  // Allow cross-origin requests

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new order
app.post('/api/orders', async (req, res) => {
  const { name, price } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO orders (name, price) VALUES (?, ?)',
      [name, price]
    );
    res.status(201).json({ id: result.insertId, name, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update an order
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE orders SET name = ?, price = ? WHERE id = ?',
      [name, price, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ id, name, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Delete an order
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM orders WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

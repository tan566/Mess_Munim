const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get wallet balance — student can only access their own
router.get('/wallet/:userId', auth(['student', 'admin']), async (req, res) => {
    try {
        const { userId } = req.params;

        // Students can only view their own wallet
        if (req.user.role === 'student' && req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const [users] = await db.query(
            'SELECT balance, roll_no, email, status FROM users WHERE id = ?',
            [userId]
        );
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json({
            balance: users[0].balance || 0,
            roll_no: users[0].roll_no,
            email: users[0].email,
            status: users[0].status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch wallet' });
    }
});

// Checkout — student can only checkout for themselves
router.post('/checkout', auth(['student']), async (req, res) => {
    try {
        const { userId, amount, description } = req.body;

        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const [users] = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const currentBalance = parseFloat(users[0].balance) || 0;
        if (currentBalance < amount) {
            return res.status(400).json({ error: 'Insufficient wallet balance!' });
        }

        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, description, amount, status) VALUES (?, ?, ?, ?)',
            [userId, description, amount, 'pending']
        );

        const orderId = orderResult.insertId;
        const qrPayload = JSON.stringify({ orderId, userId, amount, description, type: 'a_la_carte' });

        res.json({
            message: 'QR Generated! Balance will deduct when staff scans it.',
            currentBalance,
            qrPayload,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process checkout' });
    }
});

module.exports = router;

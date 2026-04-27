const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/scan', async (req, res) => {
    try {
        const { payload } = req.body;
        // payload should be the JSON string from the QR code
        
        if (!payload) return res.status(400).json({ error: 'Missing QR Payload' });
        
        let data;
        try {
            data = JSON.parse(payload);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid QR Format. Must be valid JSON from the app.' });
        }

        const { userId, type, orderId, amount } = data;

        if (type === 'subscription') {
            // Check if user is approved
            const [users] = await db.query('SELECT status, roll_no FROM users WHERE id = ?', [userId]);
            if (users.length === 0) return res.status(404).json({ error: 'Student not found.' });
            if (users[0].status !== 'approved') return res.status(403).json({ error: 'Student is not approved for subscription meals.' });
            
            // Record a general meal consumption
            await db.query(
                'INSERT INTO orders (user_id, description, amount, status) VALUES (?, ?, ?, ?)',
                [userId, 'Subscription Meal (Breakfast/Lunch/Dinner)', 0, 'fulfilled']
            );

            return res.json({ message: 'Success! Subscription Meal Approved.', student: users[0].roll_no });
        } 
        else if (type === 'a_la_carte') {
            // Verify order exists and is pending
            const [orders] = await db.query('SELECT * FROM orders WHERE id = ? AND status = ?', [orderId, 'pending']);
            if (orders.length === 0) {
                return res.status(400).json({ error: 'Order not found or already fulfilled.' });
            }

            // Deduct the balance now!
            const [users] = await db.query('SELECT balance FROM users WHERE id = ?', [userId]);
            const currentBalance = users[0].balance || 0;
            
            if (currentBalance < amount) {
                return res.status(400).json({ error: 'Student has insufficient wallet balance!' });
            }

            const newBalance = currentBalance - amount;
            await db.query('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);

            // Mark order as fulfilled
            await db.query('UPDATE orders SET status = ? WHERE id = ?', ['fulfilled', orderId]);

            return res.json({ message: `Success! ₹${amount} deducted. Extra meal approved.` });
        }
        else {
            return res.status(400).json({ error: 'Unknown QR type.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process scan' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.post('/scan', auth(['staff', 'admin']), async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { payload } = req.body;
        if (!payload) return res.status(400).json({ error: 'Missing QR Payload' });

        let data;
        try {
            data = JSON.parse(payload);
        } catch {
            return res.status(400).json({ error: 'Invalid QR Format. Must be valid JSON from the app.' });
        }

        const { userId, type, orderId, amount } = data;

        await conn.beginTransaction();

        if (type === 'subscription') {
            const [users] = await conn.query('SELECT status, roll_no FROM users WHERE id = ?', [userId]);
            if (users.length === 0) {
                await conn.rollback();
                return res.status(404).json({ error: 'Student not found.' });
            }
            if (users[0].status !== 'approved') {
                await conn.rollback();
                return res.status(403).json({ error: 'Student is not approved for subscription meals.' });
            }

            await conn.query(
                'INSERT INTO orders (user_id, description, amount, status) VALUES (?, ?, ?, ?)',
                [userId, 'Subscription Meal', 0, 'fulfilled']
            );

            await conn.commit();
            return res.json({ message: 'Success! Subscription Meal Approved.', student: users[0].roll_no });

        } else if (type === 'a_la_carte') {
            const [orders] = await conn.query(
                'SELECT * FROM orders WHERE id = ? AND status = ? FOR UPDATE',
                [orderId, 'pending']
            );
            if (orders.length === 0) {
                await conn.rollback();
                return res.status(400).json({ error: 'Order not found or already fulfilled.' });
            }

            const [users] = await conn.query('SELECT balance FROM users WHERE id = ? FOR UPDATE', [userId]);
            const currentBalance = parseFloat(users[0].balance) || 0;

            if (currentBalance < amount) {
                await conn.rollback();
                return res.status(400).json({ error: 'Student has insufficient wallet balance!' });
            }

            await conn.query('UPDATE users SET balance = balance - ? WHERE id = ?', [amount, userId]);
            await conn.query('UPDATE orders SET status = ? WHERE id = ?', ['fulfilled', orderId]);

            await conn.commit();
            return res.json({ message: `Success! ₹${amount} deducted. Extra meal approved.` });

        } else {
            await conn.rollback();
            return res.status(400).json({ error: 'Unknown QR type.' });
        }

    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ error: 'Failed to process scan' });
    } finally {
        conn.release();
    }
});

module.exports = router;

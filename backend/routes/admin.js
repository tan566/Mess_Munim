const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all pending student approvals
router.get('/pending-approvals', async (req, res) => {
    try {
        const [users] = await db.query(`
            SELECT u.id, u.email, u.roll_no, h.name as hostel_name, u.status 
            FROM users u
            LEFT JOIN hostels h ON u.hostel_id = h.id
            WHERE u.status = 'pending' AND u.role = 'student'
        `);
        
        // Fetch documents for these users
        if (users.length > 0) {
            const userIds = users.map(u => u.id);
            const [docs] = await db.query(`
                SELECT user_id, document_type, file_path 
                FROM documents 
                WHERE user_id IN (?)
            `, [userIds]);
            
            // Map documents back to users
            users.forEach(user => {
                user.documents = docs.filter(d => d.user_id === user.id).map(d => ({
                    type: d.document_type,
                    url: `/uploads/${d.file_path}` // Client can use this URL to download/view the file
                }));
            });
        }
        
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching pending approvals' });
    }
});

// Approve or reject a student
router.post('/approve-student/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { action, initialBalance } = req.body; // 'approve' or 'reject', plus balance
        
        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({ error: 'Invalid action. Must be approve or reject.' });
        }
        
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        const balance = initialBalance ? parseFloat(initialBalance) : 0;
        
        await db.query('UPDATE users SET status = ?, balance = ? WHERE id = ?', [newStatus, balance, userId]);
        
        res.json({ message: `Student status updated to ${newStatus} with initial balance ₹${balance}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating student status' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

const OFFICIAL_DOMAIN = '@nitj.ac.in';

// Register endpoint with multiple file uploads
router.post('/register-student', (req, res, next) => {
    const uploadMiddleware = upload.fields([
        { name: 'allocationProof', maxCount: 1 },
        { name: 'feeReceipt', maxCount: 1 }
    ]);

    uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).json({ 
                error: `File upload error: ${err.message}. Please check if your file keys are exactly 'allocationProof' and 'feeReceipt'.` 
            });
        } else if (err) {
            // An unknown error occurred.
            return res.status(500).json({ error: err.message });
        }
        next(); // Everything went fine
    });
}, async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Body is missing' });
        }
        const { email, password, roll_no, hostel_id } = req.body;
        
        // Validation
        if (!email || !email.endsWith(OFFICIAL_DOMAIN)) {
            return res.status(400).json({ error: `Must register with an official ${OFFICIAL_DOMAIN} email` });
        }
        
        const files = req.files;
        if (!files || !files['allocationProof'] || !files['feeReceipt']) {
            return res.status(400).json({ error: 'Both allocation proof and fee receipt are required' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert user as pending
        const [userResult] = await db.query(
            'INSERT INTO users (email, password_hash, role, status, hostel_id, roll_no) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password_hash, 'student', 'pending', hostel_id, roll_no]
        );
        const userId = userResult.insertId;

        // Insert document records
        const allocationProofPath = files['allocationProof'][0].filename;
        const feeReceiptPath = files['feeReceipt'][0].filename;

        await db.query(
            'INSERT INTO documents (user_id, document_type, file_path) VALUES (?, ?, ?), (?, ?, ?)',
            [userId, 'allocation_proof', allocationProofPath, userId, 'fee_receipt', feeReceiptPath]
        );

        res.status(201).json({ message: 'Registration successful. Waiting for admin approval.' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error during registration' });
    }
});

// Basic Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Mock fallback for admin and staff testing
        if (email.toLowerCase().includes('admin')) {
            return res.json({ message: 'Login successful', user: { id: 0, role: 'admin', status: 'approved' }});
        }
        if (email.toLowerCase().includes('staff')) {
            return res.json({ message: 'Login successful', user: { id: 0, role: 'staff', status: 'approved' }});
        }
        
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        if (user.status === 'pending') {
            return res.status(403).json({ error: 'Your account is pending admin approval' });
            return res.status(403).json({ 
                error: 'Account Pending',
                message: 'Your documents are currently under review by the Admin. Please check back later.' 
            });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ 
                error: 'Account Rejected',
                message: 'Your application was rejected. Please contact support.' 
            });
        }
        
        return res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Failed to process login' });
    }
});

module.exports = router;

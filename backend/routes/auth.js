require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF, JPEG, and PNG files are allowed'));
        }
    },
});

const OFFICIAL_DOMAIN = '@nitj.ac.in';

router.post('/register-student', (req, res, next) => {
    upload.fields([
        { name: 'allocationProof', maxCount: 1 },
        { name: 'feeReceipt', maxCount: 1 },
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `File upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { email, password, roll_no, hostel_id } = req.body;

        if (!email || !email.endsWith(OFFICIAL_DOMAIN)) {
            return res.status(400).json({ error: `Must register with an official ${OFFICIAL_DOMAIN} email` });
        }
        if (!password || !roll_no || !hostel_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const files = req.files;
        if (!files?.allocationProof || !files?.feeReceipt) {
            return res.status(400).json({ error: 'Both allocation proof and fee receipt are required' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [userResult] = await db.query(
            'INSERT INTO users (email, password_hash, role, status, hostel_id, roll_no) VALUES (?, ?, ?, ?, ?, ?)',
            [email, password_hash, 'student', 'pending', hostel_id, roll_no]
        );
        const userId = userResult.insertId;

        await db.query(
            'INSERT INTO documents (user_id, document_type, file_path) VALUES (?, ?, ?), (?, ?, ?)',
            [userId, 'allocation_proof', files.allocationProof[0].filename,
             userId, 'fee_receipt', files.feeReceipt[0].filename]
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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.status === 'pending') {
            return res.status(403).json({
                error: 'Account Pending',
                message: 'Your documents are currently under review by the Admin. Please check back later.',
            });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({
                error: 'Account Rejected',
                message: 'Your application was rejected. Please contact support.',
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { id: user.id, role: user.role, status: user.status },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Failed to process login' });
    }
});

module.exports = router;

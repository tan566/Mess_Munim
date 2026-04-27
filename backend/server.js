const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const menuRoutes = require('./routes/menu');
const studentRoutes = require('./routes/student');
const staffRoutes = require('./routes/staff');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/staff', staffRoutes);

app.get('/', (req, res) => {
    res.send('Smart Mess System API is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

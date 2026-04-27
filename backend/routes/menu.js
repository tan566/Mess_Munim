const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all meals for the day
router.get('/', async (req, res) => {
    try {
        const [meals] = await db.query('SELECT * FROM daily_meals ORDER BY id ASC');
        res.json(meals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
});

// Update a specific daily meal
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, price, is_available } = req.body;

        await db.query(
            'UPDATE daily_meals SET description = ?, price = ?, is_available = ? WHERE id = ?',
            [description, price, is_available, id]
        );

        res.json({ message: 'Meal updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update meal' });
    }
});

module.exports = router;

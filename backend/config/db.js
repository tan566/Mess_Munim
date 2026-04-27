// TEMPORARY IN-MEMORY MOCK DATABASE
// This allows you to test the API without MySQL.
// Data will be erased when the server restarts.

let users = [];
let documents = [];
let hostels = [{ id: 1, name: 'Boys Hostel 1', mess_id: 1 }];
let userIdCounter = 1;
let ordersCounter = 1;
let orders = [];

let daily_meals = [
    { id: 1, meal_time: 'Breakfast', description: 'Aloo Paratha, Curd, Tea', price: 40, is_available: true },
    { id: 2, meal_time: 'Lunch', description: 'Unlimited Roti, Rice, Dal Fry, Seasonal Veg', price: 60, is_available: true },
    { id: 3, meal_time: 'Snacks', description: 'Samosa, Coffee', price: 20, is_available: true },
    { id: 4, meal_time: 'Dinner', description: 'Unlimited Roti, Rice, Paneer Butter Masala', price: 70, is_available: true }
];

const query = async (sqlString, params = []) => {
    const sql = sqlString.toUpperCase().trim();
    
    // Mocking: INSERT INTO users
    if (sql.startsWith('INSERT INTO USERS')) {
        // Enforce unique email
        if (users.some(u => u.email === params[0])) {
            const error = new Error('Duplicate Entry');
            error.code = 'ER_DUP_ENTRY';
            throw error;
        }
        
        const user = {
            id: userIdCounter++,
            email: params[0],
            password_hash: params[1],
            role: params[2],
            status: params[3],
            hostel_id: parseInt(params[4]),
            roll_no: params[5]
        };
        users.push(user);
        return [{ insertId: user.id }];
    }
    
    // Mocking: INSERT INTO documents
    if (sql.startsWith('INSERT INTO DOCUMENTS')) {
        const doc1 = { id: documents.length + 1, user_id: params[0], type: params[1], url: '/uploads/' + params[2] };
        documents.push(doc1);
        if (params.length > 3) {
            const doc2 = { id: documents.length + 1, user_id: params[3], type: params[4], url: '/uploads/' + params[5] };
            documents.push(doc2);
        }
        return [{}];
    }
    
    // Mocking: SELECT * FROM users (login)
    if (sql.startsWith('SELECT * FROM USERS WHERE EMAIL')) {
        const found = users.filter(u => u.email === params[0]);
        return [found];
    }
    
    // Mocking: SELECT balance FROM users (wallet lookup)
    if (sql.startsWith('SELECT BALANCE')) {
        const found = users.filter(u => u.id === parseInt(params[0]));
        return [found];
    }
    
    // Mocking: UPDATE users SET balance = ? WHERE id = ? (purely balance update)
    if (sql.startsWith('UPDATE USERS SET BALANCE = ? WHERE ID = ?')) {
        const user = users.find(u => u.id === parseInt(params[1]));
        if (user) user.balance = parseFloat(params[0]);
        return [{}];
    }

    // Mocking: INSERT INTO orders
    if (sql.startsWith('INSERT INTO ORDERS')) {
        const order = { id: ordersCounter++, user_id: params[0], description: params[1], amount: params[2], status: params[3] };
        orders.push(order);
        return [{ insertId: order.id }];
    }
    
    // Mocking: SELECT * FROM orders WHERE id = ?
    if (sql.startsWith('SELECT * FROM ORDERS WHERE ID')) {
        const found = orders.filter(o => o.id === parseInt(params[0]) && o.status === params[1]);
        return [found];
    }
    
    // Mocking: UPDATE orders SET status
    if (sql.startsWith('UPDATE ORDERS SET STATUS = ? WHERE ID = ?')) {
        const order = orders.find(o => o.id === parseInt(params[1]));
        if (order) order.status = params[0];
        return [{}];
    }
    
    // Mocking: GET /pending-approvals (The complex JOIN)
    if (sql.includes('LEFT JOIN HOSTELS H ON U.HOSTEL_ID = H.ID')) {
        const pending = users
            .filter(u => u.status === 'pending' && u.role === 'student')
            .map(u => {
                const h = hostels.find(h => h.id === u.hostel_id);
                return {
                    id: u.id,
                    email: u.email,
                    roll_no: u.roll_no,
                    hostel_name: h ? h.name : 'Unknown',
                    status: u.status
                };
            });
        return [pending];
    }
    
    // Mocking: Fetch documents for pending users
    if (sql.includes('SELECT USER_ID, DOCUMENT_TYPE, FILE_PATH FROM DOCUMENTS')) {
        const userIds = params[0] || [];
        const docs = documents.filter(d => userIds.includes(d.user_id));
        return [docs];
    }
    
    // Mocking: UPDATE users SET status
    if (sql.startsWith('UPDATE USERS SET STATUS')) {
        const user = users.find(u => u.id === parseInt(params[2]));
        if (user) {
            user.status = params[0];
            user.balance = parseFloat(params[1]);
        }
        return [{}];
    }
    
    // Mocking: SELECT * FROM daily_meals
    if (sql.startsWith('SELECT * FROM DAILY_MEALS')) {
        return [daily_meals];
    }

    // Mocking: UPDATE daily_meals
    if (sql.startsWith('UPDATE DAILY_MEALS SET')) {
        const meal = daily_meals.find(m => m.id === parseInt(params[3]));
        if (meal) {
            meal.description = params[0];
            meal.price = parseFloat(params[1]);
            meal.is_available = Boolean(params[2]);
        }
        return [{}];
    }

    return [[]];
};

module.exports = { query };

// Central mock data store — all state lives here so screens share it

export type User = {
  id: number; email: string; password: string; role: 'student' | 'staff' | 'admin';
  status: 'approved' | 'pending' | 'rejected'; rollNo: string; balance: number; hostel: string;
};

export type Meal = {
  id: number; meal_time: string; description: string; price: number; is_available: boolean;
};

export type Order = {
  id: number; userId: number; description: string; amount: number;
  status: 'pending' | 'fulfilled' | 'used'; date: string;
};

export type CartItem = {
  mealId: number; name: string; price: number; quantity: number;
};

export type PendingStudent = {
  id: number; email: string; rollNo: string; hostel: string; status: 'pending';
};

// --- Mutable state ---
export const users: User[] = [
  { id: 1, email: 'student@test.com', password: '12345678', role: 'student', status: 'approved', rollNo: '21103001', balance: 500, hostel: 'Boys Hostel 1' },
  { id: 2, email: 'staff@test.com',   password: '12345678', role: 'staff',   status: 'approved', rollNo: '',          balance: 0,   hostel: '' },
  { id: 3, email: 'admin@test.com',   password: '12345678', role: 'admin',   status: 'approved', rollNo: '',          balance: 0,   hostel: '' },
];

export const meals: Meal[] = [
  { id: 1, meal_time: 'Breakfast', description: 'Aloo Paratha, Curd, Tea',                        price: 40, is_available: true },
  { id: 2, meal_time: 'Lunch',     description: 'Unlimited Roti, Rice, Dal Fry, Seasonal Veg',    price: 60, is_available: true },
  { id: 3, meal_time: 'Snacks',    description: 'Samosa, Coffee',                                 price: 20, is_available: true },
  { id: 4, meal_time: 'Dinner',    description: 'Unlimited Roti, Rice, Paneer Butter Masala',     price: 70, is_available: true },
];

export const orders: Order[] = [
  { id: 1, userId: 1, description: 'Subscription Meal',    amount: 0,  status: 'fulfilled', date: 'Today, 8:00 AM' },
  { id: 2, userId: 1, description: 'Extra Lunch Plate',    amount: 60, status: 'fulfilled', date: 'Today, 1:15 PM' },
  { id: 3, userId: 1, description: 'Subscription Meal',    amount: 0,  status: 'fulfilled', date: 'Yesterday, 8:10 PM' },
  { id: 4, userId: 1, description: 'Added Balance',        amount: 500, status: 'fulfilled', date: 'Mon, 10:00 AM' },
];

export const pendingStudents: PendingStudent[] = [
  { id: 10, email: 'newstudent1@nitj.ac.in', rollNo: '21103050', hostel: 'Boys Hostel 1', status: 'pending' },
  { id: 11, email: 'newstudent2@nitj.ac.in', rollNo: '21103051', hostel: 'Boys Hostel 2', status: 'pending' },
];

let orderIdCounter = 100;

// --- Cart state (per user, keyed by userId) ---
export const carts: Record<number, CartItem[]> = {};

export function getCart(userId: number): CartItem[] {
  return carts[userId] || [];
}

export function addToCart(userId: number, meal: Meal) {
  if (!carts[userId]) carts[userId] = [];
  const existing = carts[userId].find(i => i.mealId === meal.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    carts[userId].push({ mealId: meal.id, name: meal.meal_time, price: meal.price, quantity: 1 });
  }
}

export function updateCartQty(userId: number, mealId: number, delta: number) {
  if (!carts[userId]) return;
  const item = carts[userId].find(i => i.mealId === mealId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) carts[userId] = carts[userId].filter(i => i.mealId !== mealId);
}

export function clearCart(userId: number) {
  carts[userId] = [];
}

// --- Mock API functions ---

export function mockLogin(email: string, password: string): User | null {
  return users.find(u => u.email === email && u.password === password) ?? null;
}

export function mockGetStudent(userId: number): User | undefined {
  return users.find(u => u.id === userId);
}

export function mockCheckout(userId: number, amount: number, description: string): { qrPayload: string } | { error: string } {
  const user = users.find(u => u.id === userId);
  if (!user) return { error: 'User not found' };
  if (user.balance < amount) return { error: 'Insufficient wallet balance!' };
  // Don't deduct yet — deduct on scan
  const orderId = orderIdCounter++;
  orders.push({ id: orderId, userId, description, amount, status: 'pending', date: 'Just now' });
  clearCart(userId);
  return { qrPayload: JSON.stringify({ orderId, userId, amount, description, type: 'a_la_carte' }) };
}

export function mockScan(payload: string): { message: string } | { error: string } {
  let data: any;
  try { data = JSON.parse(payload); } catch { return { error: 'Invalid QR format' }; }

  const { userId, type, orderId, amount } = data;
  const user = users.find(u => u.id === userId);
  if (!user) return { error: 'Student not found' };

  if (type === 'subscription') {
    if (user.status !== 'approved') return { error: 'Student not approved' };
    orders.push({ id: orderIdCounter++, userId, description: 'Subscription Meal', amount: 0, status: 'fulfilled', date: 'Just now' });
    return { message: `✅ Subscription Meal Approved for ${user.rollNo}` };
  }

  if (type === 'a_la_carte') {
    const order = orders.find(o => o.id === orderId && o.status === 'pending');
    if (!order) return { error: 'Order not found or already used' };
    if (user.balance < amount) return { error: 'Insufficient balance' };
    user.balance -= amount;
    order.status = 'used';
    return { message: `✅ ₹${amount} deducted. Extra meal approved.` };
  }

  return { error: 'Unknown QR type' };
}

export function mockApprovePendingStudent(id: number, action: 'approve' | 'reject', initialBalance: number) {
  const idx = pendingStudents.findIndex(s => s.id === id);
  if (idx === -1) return;
  const s = pendingStudents[idx];
  if (action === 'approve') {
    users.push({ id: s.id, email: s.email, password: '12345678', role: 'student', status: 'approved', rollNo: s.rollNo, balance: initialBalance, hostel: s.hostel });
  }
  pendingStudents.splice(idx, 1);
}

export function mockUpdateMeal(id: number, description: string, price: number, is_available: boolean) {
  const meal = meals.find(m => m.id === id);
  if (meal) { meal.description = description; meal.price = price; meal.is_available = is_available; }
}

export function mockRegisterStudent(email: string, rollNo: string, hostel: string) {
  const id = Date.now();
  pendingStudents.push({ id, email, rollNo, hostel, status: 'pending' });
}

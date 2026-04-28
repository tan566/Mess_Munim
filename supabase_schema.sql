-- ============================================================
-- Smart Mess System — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'staff', 'admin')),
  roll_no       TEXT DEFAULT '',
  hostel        TEXT DEFAULT '',
  balance       NUMERIC(10,2) DEFAULT 0,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  allocation_proof_url TEXT,
  fee_receipt_url      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Daily Meals
CREATE TABLE daily_meals (
  id           SERIAL PRIMARY KEY,
  meal_time    TEXT NOT NULL,
  description  TEXT NOT NULL,
  price        NUMERIC(8,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Orders
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id),
  description TEXT NOT NULL,
  amount      NUMERIC(8,2) NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'used')),
  qr_payload  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transactions
CREATE TABLE transactions (
  id          SERIAL PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id),
  type        TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount      NUMERIC(8,2) NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Seed default meals
-- ============================================================
INSERT INTO daily_meals (meal_time, description, price) VALUES
  ('Breakfast', 'Aloo Paratha, Curd, Tea',                     40),
  ('Lunch',     'Unlimited Roti, Rice, Dal Fry, Seasonal Veg', 60),
  ('Snacks',    'Samosa, Coffee',                              20),
  ('Dinner',    'Unlimited Roti, Rice, Paneer Butter Masala',  70);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"   ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Authenticated can read all profiles" ON profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Daily meals: all authenticated users can read; authenticated can update (admin enforced in app)
CREATE POLICY "Authenticated can read meals"   ON daily_meals FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update meals" ON daily_meals FOR UPDATE USING (auth.role() = 'authenticated');

-- Orders
CREATE POLICY "Users can view own orders"   ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can read all orders" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update all orders" ON orders FOR UPDATE USING (auth.role() = 'authenticated');

-- Transactions
CREATE POLICY "Users can view own transactions"   ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated can read all transactions" ON transactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can insert all transactions" ON transactions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket: create via Dashboard → Storage → New Bucket
--   Name: documents   |   Public: false
-- ============================================================

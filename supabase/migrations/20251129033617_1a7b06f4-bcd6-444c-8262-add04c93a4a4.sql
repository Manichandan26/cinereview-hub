-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

-- Create a permissive policy that allows anyone to insert
CREATE POLICY "Anyone can insert users"
ON users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also allow anyone to view users (if not already set)
DROP POLICY IF EXISTS "Users can view all profiles" ON users;

CREATE POLICY "Anyone can view users"
ON users
FOR SELECT
TO anon, authenticated
USING (true);
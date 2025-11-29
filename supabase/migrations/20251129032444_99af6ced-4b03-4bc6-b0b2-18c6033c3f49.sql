-- Users Table
CREATE TABLE public.users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Movies Table
CREATE TABLE public.movies (
    movie_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    genre VARCHAR(50),
    release_year INT,
    poster_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE public.reviews (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_id UUID REFERENCES public.movies(movie_id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles"
ON public.users FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies for movies table
CREATE POLICY "Anyone can view movies"
ON public.movies FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Anyone can insert movies"
ON public.movies FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Anyone can insert reviews"
ON public.reviews FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE
TO authenticated
USING (true);
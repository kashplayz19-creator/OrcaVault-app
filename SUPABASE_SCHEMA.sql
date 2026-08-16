-- Orca Vault: market_indicators Schema Migration & Security Policies

-- 1. Create Table
CREATE TABLE IF NOT EXISTS public.market_indicators (
    symbol TEXT PRIMARY KEY,
    price NUMERIC(12, 2) NOT NULL,
    rsi NUMERIC(5, 2) NOT NULL,
    support_level NUMERIC(12, 2) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Indexes for High-Speed Queries
CREATE INDEX IF NOT EXISTS idx_market_indicators_updated_at ON public.market_indicators(updated_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.market_indicators ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Public Read Access (All authenticated and anon users can read)
CREATE POLICY "Allow public read access to market indicators"
    ON public.market_indicators
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 5. RLS Policy: Service Role Write Access (Only backend / service_role key can insert/update)
CREATE POLICY "Allow service role full access"
    ON public.market_indicators
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

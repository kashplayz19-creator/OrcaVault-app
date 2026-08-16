import os
import sys
import time
import logging
import numpy as np
import pandas as pd
import yfinance as yf
from supabase import create_client, Client

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("market_sync")

# Target Equities / ETFs (NSE Format)
TARGET_TICKERS = [
    "HDFCBANK.NS",
    "TCS.NS",
    "RELIANCE.NS",
    "INFY.NS",
    "ICICIBANK.NS",
    "BHARTIARTL.NS",
    "ITC.NS",
    "SBIN.NS",
    "LTIM.NS",
    "NIFTYBEES.NS"
]

def calculate_wilders_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    """
    Calculates Wilder's Exponential Smoothing RSI.
    Wilder's RSI uses an alpha = 1 / period exponential moving average for gains and losses.
    Returns a pandas Series with no NaN values (filled/handled safely).
    """
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -1 * delta.clip(upper=0)

    # First value is simple average
    avg_gain = gain.ewm(alpha=1/period, min_periods=period, adjust=False).mean()
    avg_loss = loss.ewm(alpha=1/period, min_periods=period, adjust=False).mean()

    # Prevent division by zero
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))

    # Fill NaNs safely
    rsi = rsi.fillna(50.0)
    return rsi

def compute_support_level(df: pd.DataFrame) -> float:
    """
    Calculates a key technical support level based on recent 20-period low and pivot points.
    """
    if len(df) < 20:
        return float(df['Low'].min())
    recent_20 = df.tail(20)
    period_low = float(recent_20['Low'].min())
    latest_close = float(df['Close'].iloc[-1])
    return round(min(period_low, latest_close * 0.95), 2)

def main():
    logger.info("Initializing Orca Vault Market Sync Pipeline...")

    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        logger.error("FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing.")
        sys.exit(1)

    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        logger.info("Successfully connected to Supabase client.")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        sys.exit(1)

    upsert_records = []

    for idx, ticker in enumerate(TARGET_TICKERS):
        logger.info(f"[{idx+1}/{len(TARGET_TICKERS)}] Fetching OHLCV data for {ticker}...")
        
        try:
            # Pull 3 months of daily data
            stock = yf.Ticker(ticker)
            df = stock.history(period="3mo", interval="1d")

            if df.empty or len(df) < 15:
                logger.warning(f"Insufficient or empty market data for {ticker}. Skipping.")
                continue

            # Ensure Close series is clean
            close_series = df['Close']
            rsi_series = calculate_wilders_rsi(close_series, period=14)

            latest_price = round(float(close_series.iloc[-1]), 2)
            latest_rsi = round(float(rsi_series.iloc[-1]), 2)
            support_level = compute_support_level(df)

            record = {
                "symbol": ticker,
                "price": latest_price,
                "rsi": latest_rsi,
                "support_level": support_level,
                "updated_at": pd.Timestamp.now(tz="UTC").isoformat()
            }
            
            upsert_records.append(record)
            logger.info(f"Parsed {ticker} -> Price: ₹{latest_price} | RSI: {latest_rsi} | Support: ₹{support_level}")

        except Exception as err:
            logger.error(f"Error processing ticker {ticker}: {err}")

        # Enforce explicit 2-second rate limit buffer between requests
        if idx < len(TARGET_TICKERS) - 1:
            logger.info("Pausing 2 seconds to respect Yahoo Finance rate limits...")
            time.sleep(2)

    if not upsert_records:
        logger.warning("No market indicator records were successfully computed. Exiting.")
        sys.exit(0)

    logger.info(f"Upserting {len(upsert_records)} records into Supabase `market_indicators` table...")

    try:
        response = supabase.table("market_indicators").upsert(
            upsert_records,
            on_conflict="symbol"
        ).execute()

        logger.info(f"Successfully upserted data to Supabase. Records processed: {len(upsert_records)}")
    except Exception as e:
        logger.error(f"Failed to upsert market indicators to Supabase: {e}")
        sys.exit(1)

    logger.info("Market Sync Pipeline executed cleanly.")

if __name__ == "__main__":
    main()

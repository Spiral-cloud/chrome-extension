import yfinance as yf
import pandas as pd

data = yf.download("AAPL", start="2026-01-01", end="2026-01-31")
print(data.head())
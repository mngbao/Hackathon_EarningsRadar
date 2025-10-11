// app/api/finance/route.js

import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2'; // Use the installed library

// Define the GET request handler
export async function GET(request) {
  // Get the 'ticker' parameter from the request URL (e.g., /api/finance?ticker=AAPL)
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
  }

  try {
    // Use the library to fetch real-time quote data
    const quote = await yahooFinance.insights(ticker.toUpperCase());

    // Return the fetched data as a JSON response
    return NextResponse.json(quote, { status: 200 });

  } catch (error) {
    console.error(`Error fetching data for ${ticker}:`, error);
    // Handle API errors gracefully
    return NextResponse.json({ error: `Failed to fetch data for ${ticker}` }, { status: 500 });
  }
}

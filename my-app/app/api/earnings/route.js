import { NextResponse } from 'next/server';

// Add these missing constants
const API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Function to calculate tomorrow's date in YYYY-MM-DD format
function getTomorrowDate() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json({ error: 'FINNHUB_API_KEY not set in .env.local' }, { status: 500 });
  }

  const tomorrow = getTomorrowDate();
  
  // Finnhub endpoint to fetch earnings from=tomorrow to=tomorrow
  const url = `${BASE_URL}/calendar/earnings?from=${tomorrow}&to=${tomorrow}&token=${API_KEY}`;

  try {
    const res = await fetch(url, {
      // Use revalidate to cache the results for a period (e.g., 6 hours = 21600 seconds)
      next: { revalidate: 21600 } 
    });

    if (!res.ok) {
      throw new Error(`Finnhub API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // The Finnhub API returns results under the 'calendar' key
    const earningsList = data.calendar || [];

    // Map and simplify the results for cleaner use in the frontend
    const simplifiedList = earningsList.map((item) => ({
      symbol: item.symbol,
      date: item.date,
      estimate: item.epsEstimate,
      // Time is typically BMO (Before Market Open) or AMC (After Market Close)
      time: item.hour || 'N/A'
    }));

    return NextResponse.json(simplifiedList);

  } catch (error) {
    console.error('Earnings API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch earnings calendar' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';


const API_KEY = process.env.FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/stable/';

// Function to get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date()
  today.setDate(today.getDate()+1);
  return today.toISOString().split('T')[0];
}

// Function to get date N days from today in YYYY-MM-DD format
function getDateDaysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export async function GET(request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'FMP_API_KEY not set in .env.local' }, { status: 500 });
  }

  // Get query parameters to allow flexible date ranges
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get('days');
  const daysAhead = daysParam ? parseInt(daysParam) : 7; // Default to 7 days

  const fromDate = getTodayDate();
  const toDate = getDateDaysFromNow(daysAhead);
  
  // Finnhub endpoint to fetch earnings for the week
  const url = `${BASE_URL}earnings-calendar?to=${toDate}&apikey=${API_KEY}`;
  

  try {
    const res = await fetch(url, {
      // Cache for 6 hours (21600 seconds)
      next: { revalidate: 21600 } 
    });

    if (!res.ok) {
      throw new Error(`FMP API error: ${res.status} ${res.statusText}`);
    }


    const data = await res.json();

    // FMP returns an array directly
    const earningsList = Array.isArray(data) ? data : [];

    const today = new Date();

    // Map and simplify the results for cleaner use in the frontend
    const simplifiedList = earningsList
    .filter((item)=>new Date(item.date) >= today)
    .map((item) => ({
      symbol: item.symbol,
      date: item.date ,
      epsEstimated: item.epsEstimated,
      actual: item.epsActual || null,
      revenueEstimated: item.revenueEstimated || null,
      revenueActual: item.revenueActual || null
    }));

    const tickerList = simplifiedList.map(item => ({ symbol: item.symbol }));


    // Group earnings by date for easier frontend rendering
    const groupedByDate = simplifiedList.reduceRight((acc, earning) => {
      if (!acc[earning.date]) {
        acc[earning.date] = [];
      }
      tickerList.concat(earning.symbol,",")
      acc[earning.date].push(earning);
      return acc;
    }, {});

    return NextResponse.json({
      dateRange: {
        from: fromDate,
        to: toDate
      },
      count: simplifiedList.length,
      earnings: simplifiedList,
      groupedByDate: groupedByDate,
      tickerList,
    });

  } catch (error) {
    console.error('Earnings API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch earnings calendar',
      details: error.message 
    }, { status: 500 });
  }
}
// app/components/StockQuote.tsx

import React from 'react';

// Define the structure for the data we expect from our API
interface StockData {
  symbol: string;
  displayName: string;
  regularMarketPrice: number;
  marketCap: number;
  error?: string; // For handling API errors
}

// 1. Fetch Data Function (Server-side)
async function fetchStockData(ticker: string): Promise<StockData> {
  // Assuming the internal route handler is at /api/finance
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/finance?ticker=${ticker}`, {
    cache: 'no-store', 
  });

  if (!res.ok) {
    return { error: `Network error: ${res.statusText}` } as StockData;
  }

  const data: StockData = await res.json();
  return data;
}

// 2. Stock Quote Server Component
export default async function StockQuote({ tickerSymbol = 'TSLA' }: { tickerSymbol?: string }) {
  const data = await fetchStockData(tickerSymbol);

  // --- Error Handling ---
  if (data.error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-xl text-center border-l-4 border-red-500 mb-6">
        <h2 className="text-xl font-bold text-red-600">Quote Error</h2>
        <p className="mt-2 text-gray-700">Could not retrieve quote for {tickerSymbol}.</p>
        <p className="mt-1 text-sm text-gray-500">Details: {data.error}</p>
      </div>
    );
  }

  // --- Successful Data Display (using Tailwind CSS) ---
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-2xl transition hover:shadow-3xl">
      <h2 className="text-3xl font-extrabold text-green-700 border-b pb-3 mb-4">
        {data.displayName || 'Stock Quote'}
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium text-gray-500">Symbol:</span>
          <span className="text-2xl font-bold text-gray-900">{data.symbol}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-gray-200">
          <span className="text-xl font-medium text-gray-500">Current Price:</span>
           <span className={`text-3xl font-extrabold ${data.regularMarketPrice > 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${data.regularMarketPrice ? data.regularMarketPrice.toFixed(2) : 'N/A'}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-lg font-medium text-gray-500">Market Cap:</span>
          <span className="text-xl font-semibold text-gray-800">
            {/* Simple function to format large numbers */}
            {data.marketCap ? (data.marketCap / 1_000_000_000).toFixed(2) + ' B' : 'N/A'}
          </span>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-6 text-center">
          Data via Yahoo Finance Route Handler.
      </p>
    </div>
  );
}
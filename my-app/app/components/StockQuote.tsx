// app/components/StockQuote.tsx

import React from 'react';

// Define the structure for the data we expect from our API
// Define nested types
interface TechnicalOutlook {
  stateDescription: string;
  direction: string;
  score: number;
  scoreDescription: string;
  sectorDirection: string;
  sectorScore: number;
  sectorScoreDescription: string;
  indexDirection: string;
  indexScore: number;
  indexScoreDescription: string;
}

interface TechnicalEvents {
  provider: string;
  sector: string;
  shortTermOutlook: TechnicalOutlook;
  intermediateTermOutlook: TechnicalOutlook;
  longTermOutlook:TechnicalOutlook;
}

export interface StockData {
  symbol: string;
  instrumentInfo: {
    technicalEvents: TechnicalEvents;
  };
  error?: string;
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
export default async function StockQuote({ tickerSymbol = 'AMD' }: { tickerSymbol?: string }) {
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
   <div className="mt-6 p-4 border-t">
  <h3 className="text-lg font-bold text-gray-700">Insights</h3>
  {data.instrumentInfo?.technicalEvents ? (
    <>
      <h2 className="text-gray-600">{data.symbol}</h2>
      <p className="text-gray-600">
        Short-term outlook: <span className="font-semibold">{data.instrumentInfo.technicalEvents.shortTermOutlook.direction}</span> 
        ({data.instrumentInfo.technicalEvents.shortTermOutlook.scoreDescription})
      </p>
      <p className="text-gray-600">
        Intermediate-term outlook: <span className="font-semibold">{data.instrumentInfo.technicalEvents.intermediateTermOutlook.direction}</span> 
        ({data.instrumentInfo.technicalEvents.intermediateTermOutlook.scoreDescription})
      </p>
      <p className="text-gray-600">
        Intermediate-term outlook: <span className="font-semibold">{data.instrumentInfo.technicalEvents.longTermOutlook.direction}</span> 
        ({data.instrumentInfo.technicalEvents.longTermOutlook.scoreDescription})
      </p>
    </>
  ) : (
    <p className="text-gray-400">No insights available.</p>
  )}
</div>

  );
}
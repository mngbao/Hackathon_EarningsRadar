// app/page.tsx
import React from 'react';
import EarningsCalendar from './components/EarningsCalendar'; // Component from previous step
import StockQuote from './components/StockQuote'; // New component

export default async function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8 md:p-12 lg:p-16">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">
          Financial Dashboard 🚀
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Your daily snapshot of the market.
        </p>
      </header>

      {/* Two-Column Layout (Desktop) / Stacked (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: Single Stock Quote */}
        <div className="lg:col-span-1">
          <StockQuote tickerSymbol="AAPL" />
          <div className='mt-8 text-center text-sm text-gray-500'>
             Quickly check a favorite ticker.
          </div>
        </div>

        {/* RIGHT COLUMN: Earnings Calendar (Takes up 2/3 of the width) */}
        <div className="lg:col-span-2">
          <EarningsCalendar />
        </div>

      </div>
    </main>
  );
}
// app/page.tsx
import React from 'react';
import EarningsCalendar from './components/EarningsCalendar'; // Component from previous step

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

        <div className="lg:col-span-1">
          <EarningsCalendar />
        </div>

    </main>
  );
}
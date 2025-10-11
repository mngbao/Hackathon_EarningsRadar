'use client';

import { useState, useEffect } from 'react';

import { Earning, EarningsResponse } from '../api/interface';
import { Button} from '@mui/material';
import StockAnalysis from "./StockAnalysis";

const EarningsCalendar = () => {
  const [earningsData, setEarningsData] = useState<EarningsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [daysAhead, setDaysAhead] = useState<number>(4);
  // const [tickerListData, setTickerListData] = useState<String | null>();
  // // const [triggerAnalysis, setTriggerAnalysis] = useState(false);

  // const [stockMap, setStockMap] = useState<StockMap|null>();
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [analysisCache, setAnalysisCache] = useState<Record<string, string>>({});

 const handleCacheUpdate = (symbol: string, result: string) => {
    if (!result) return; // skip if somehow empty
    setAnalysisCache((prev) => ({
      ...prev,
      [symbol]: result,
    }));
  };

  const fetchEarnings = async (days: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/earnings?days=${days}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch earnings');
      }
      
      const data: EarningsResponse = await response.json();
      setEarningsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings(daysAhead);
  }, [daysAhead]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error Loading Earnings</h3>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!earningsData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  
  const handleToggleRow = (symbol: string) => {
    setExpandedRow((prev) => (prev === symbol ? null : symbol));
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Earnings Calendar
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {earningsData.count} companies reporting from {formatDate(earningsData.dateRange.from)} to {formatDate(earningsData.dateRange.to)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setDaysAhead(1)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              daysAhead === 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setDaysAhead(7)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              daysAhead === 7
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setDaysAhead(30)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              daysAhead === 30
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Month
          </button>
        </div>
      </div>  
      
      
      {earningsData.count === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <p className="text-gray-600">No earnings scheduled for this period.</p>
        </div>
      ) : (
        <div className="space-y-6">
            {Object.entries(earningsData.groupedByDate).map(([date, earnings]) => {

            return(
            <div key={date} style={{ backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#f9fafb', padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
                  {formatDate(date)}
                  <span style={{ marginLeft: '8px', fontSize: '14px', fontWeight: '400', color: '#6b7280' }}>
                    ({earnings.length} {earnings.length === 1 ? 'company' : 'companies'})
                  </span>
                </h3>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Symbol
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      EPS Est.
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Revenue Est.
                    </th>
                    <th style={{ padding: '12px 24px', textAlign: 'right', fontSize: '12px', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Analyze
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning: Earning,index:number) => {
                    const cachedResult = analysisCache[earning.symbol];

                    return (
                    <>
                    <tr key={`${earning.symbol}-${index}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {earning.symbol}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                        {earning.epsEstimated !== null && earning.epsEstimated !== undefined 
                          ? `${earning.epsEstimated.toFixed(2)}` 
                          : 'N/A'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                        {earning.revenueEstimated 
                          ? `${(earning.revenueEstimated / 1000000000).toFixed(2)}B` 
                          : 'N/A'}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                        <Button onClick={() => handleToggleRow(earning.symbol)}>
                          {expandedRow === earning.symbol ? 'Hide' : 'Details'}
                        </Button>
                      </td>
                      
                    </tr>
                    {expandedRow === earning.symbol && (
                      <tr>
                        <td
                          colSpan={4}
                          style={{
                            color: '#111827',
                            backgroundColor: '#f9fafb',
                            padding: '16px 24px',
                          }}
                        >
                          <StockAnalysis
                            tickers={earning.symbol}
                            trigger={!cachedResult} // only run API if no cache
                            cachedResult={cachedResult}
                            onComplete={(result) => handleCacheUpdate(earning.symbol, result)}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                  )})}
                  
                </tbody> 
              </table>
            </div>
          )})}
        </div>
      )}
      <div>
        

      </div>
    </div>
  );
};

export default EarningsCalendar;
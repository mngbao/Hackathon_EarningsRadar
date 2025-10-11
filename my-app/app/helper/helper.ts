
import stockMap from '../../sp500comp.json';
// Define the type for the structure of the stock data map.
// The keys (string) are the stock symbols (tickers), and the values (string) are the company names.


interface StockMap {
    [ticker: string]: string;
}


// Define the mock JSON data structure for demonstration purposes.

/**
 * Looks up company names based on a comma-separated string of stock tickers.
 * * @param jsonMap The stock data map ({Symbol: Name}) adhering to the StockMap interface.
 * @param tickerString A comma-separated string of tickers (e.g., "PLTR,DAL,PEP").
 * @returns A comma-separated string of found company names.
 */

export function lookupTickers(tickerString: string): string {
    // 1. Split the input string by comma and remove any surrounding whitespace.
    // Tickers are converted to uppercase to ensure case-insensitive lookup.
    const tickers: string[] = tickerString
        .split(',')
        .map(ticker => ticker.trim().toUpperCase()) 
        .filter(ticker => ticker.length > 0); 
    const myData: StockMap = stockMap as StockMap;

    const foundNames: string[] = [];
    

    // 2. Iterate through the cleaned list of tickers.
    tickers.forEach(ticker => {
        // TypeScript safely looks up the key in the typed map.
        const companyName: string | undefined = myData[ticker];

        // 3. Check if the ticker exists in the JSON map.
        if (companyName) {
            foundNames.push(companyName);
        }
    });

    // 4. Join the array of found names into a single comma-separated string.
    return foundNames.join(', ');
}

// --- Demonstration of Usage ---

// const userQuery1: string = "A,MSFT,DAL";
// const result1: string = lookupTickers(STOCK_MAP, userQuery1);
// console.log(`Query: ${userQuery1}`);
// console.log(`Result: ${result1}`); 
// // Expected Output: Agilent Technologies Inc. Common Stock, Microsoft Corp., Delta Air Lines, Inc.

// const userQuery2: string = "PEP, TSLA, AACB"; // TSLA is not in the mock data
// const result2: string = lookupTickers(STOCK_MAP, userQuery2);
// console.log(`\nQuery: ${userQuery2}`);
// console.log(`Result: ${result2}`); 
// // Expected Output: PepsiCo, Inc., Artius II Acquisition Inc. Class A Ordinary Shares

// const userQuery3: string = "   aa,   aacbr,   "; // Handles mixed case, extra spaces, and trailing commas
// const result3: string = lookupTickers(STOCK_MAP, userQuery3);
// console.log(`\nQuery: ${userQuery3}`);
// console.log(`Result: ${result3}`); 
// // Expected Output: Alcoa Corporation Common Stock, Artius II Acquisition Inc. Rights

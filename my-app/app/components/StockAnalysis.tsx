'use client'
    import { useRef } from 'react';
    import { useState, useEffect } from 'react';
    import BuiltinPrompting from '../api/prompting';
    import { lookupTickers } from '../helper/helper';



    interface StockAnalysisProps {
    tickers: string;                 // e.g. "AAPL, MSFT, TSLA"
    trigger: boolean;                // external trigger to start analysis
    cachedResult?: string; // pre-saved analysis text
    onComplete?: (result: string) => void; // optional callback when done
    }

    const StockAnalysis = ({tickers,trigger,cachedResult,onComplete}:StockAnalysisProps) => {
        const hasRunRef = useRef(false);
        const [stockDescription, setStockDescription] = useState<string>(cachedResult || '');
        const [stockDescriptionDone, setStockDescriptionDone] = useState<boolean>(!!cachedResult);
        const [promptApiSupported, setPromptApiSupported] = useState<boolean>(true);
        const [stockApiError, setStockApiError] = useState<string>();
    useEffect(() => {
        setPromptApiSupported(BuiltinPrompting.isBuiltinAiSupported());
    }, []);

    useEffect(() => {
        if (cachedResult || !trigger || !tickers) return;
        if (hasRunRef.current) return; // ✅ prevent double run
        hasRunRef.current = true;
        setStockDescription('');
        setStockDescriptionDone(false);
        setStockApiError(undefined);

        const handleTickerList = async () => {   
            const name = lookupTickers(tickers)       
            const prompt = `Get the actual company's name of the stock ticker below and analyze it. \
                            ${name}.\
                            Action: For each stock, analyze 2 bullet point of risks and opportunities.
                            Format: Ticker - Company's name then 2 risks, 2 oppotunities.\
                            Rules: Be concise and short. And use bullet point.`;
            const urlParams = new URLSearchParams(window.location.search);
            const streaming = urlParams.get('streaming');

            try {
            const promptApi = await BuiltinPrompting.createPrompting();
            let result = '';
            if (streaming === null || streaming === 'true') {
                const reader = promptApi.streamingPrompt(prompt);
                for await (const chunk of reader) {
                    result += chunk;
                    setStockDescription(w => w + chunk);
                }
            } else {
                result = await promptApi.prompt(prompt)
                setStockDescription(result);
                
            }
            setStockDescriptionDone(true);
            if (onComplete) onComplete(result);
            } catch (e) {
            setStockApiError(`${e}`);
            }
        }
        
        handleTickerList();
    }, [trigger,tickers, cachedResult]);
    
    if (stockApiError) {
        return <div className="text-red-500">Error: {stockApiError}</div>;
    }

    return (
        <div className="p-4 bg-white rounded-2xl shadow-md border">
        {stockDescriptionDone ? (
            <pre className="whitespace-pre-wrap">{stockDescription}</pre>
        ) : (
            <p className="text-gray-500">Waiting for analysis...</p>
        )}
        </div>
    );
    
    }

export default StockAnalysis;

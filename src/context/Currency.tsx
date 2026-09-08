import { createContext, useContext, useState, type ReactNode } from 'react';
import type { CurrencyCode } from '../types';

export interface CurrencyMeta {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rate: number;       // multiplier from USD
  decimals: number;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'USD', label: 'US Dollar',          symbol: '$',   rate: 1,     decimals: 0 },
  { code: 'EUR', label: 'Euro',               symbol: '€',   rate: 0.92,  decimals: 0 },
  { code: 'GBP', label: 'British Pound',      symbol: '£',   rate: 0.79,  decimals: 0 },
  { code: 'LKR', label: 'Sri Lankan Rupee',   symbol: 'Rs',  rate: 318,   decimals: 0 },
  { code: 'SGD', label: 'Singapore Dollar',   symbol: 'S$',  rate: 1.34,  decimals: 0 },
  { code: 'AUD', label: 'Australian Dollar',  symbol: 'A$',  rate: 1.55,  decimals: 0 },
  { code: 'JPY', label: 'Japanese Yen',       symbol: '¥',   rate: 149,   decimals: 0 },
];

interface CurrencyContext {
  currency: CurrencyMeta;
  setCurrencyCode: (code: CurrencyCode) => void;
  /** Format a USD amount into the active currency with symbol */
  fmt: (usd: number) => string;
}

const Ctx = createContext<CurrencyContext | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>('USD');
  const currency = CURRENCIES.find(c => c.code === code)!;

  const fmt = (usd: number) => {
    const converted = Math.round(usd * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <Ctx.Provider value={{ currency, setCurrencyCode: setCode, fmt }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}

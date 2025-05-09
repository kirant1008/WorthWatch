export interface Item {
  id: string;
  name: string;
  value: number;
  type: string; // e.g., 'Cash', 'Stocks' for assets; 'Credit Card', 'Loan' for liabilities
  dateAdded: string;
}

export interface Asset extends Item {}
export interface Liability extends Item {}

export interface NetWorthRecord {
  date: string; // YYYY-MM-DD format
  netWorth: number;
}

export interface Currency {
  code: string; // e.g., "USD"
  symbol: string; // e.g., "$"
  name: string; // e.g., "US Dollar"
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' }, // Note: CAD symbol is often C$ or $
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' }, // Note: AUD symbol is often A$ or $
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export interface AppData {
  assets: Asset[];
  liabilities: Liability[];
  history: NetWorthRecord[];
  currency: string; // e.g., "USD"
}

export const ASSET_TYPES = [
  { value: "Cash", label: "Cash", icon: "Wallet" },
  { value: "Savings Account", label: "Savings Account", icon: "PiggyBank" },
  { value: "Stocks", label: "Stocks/Investments", icon: "LineChart" },
  { value: "Real Estate", label: "Real Estate", icon: "Home" },
  { value: "Vehicle", label: "Vehicle", icon: "Car" },
  { value: "Retirement Account", label: "Retirement Account", icon: "TrendingUp" },
  { value: "Other", label: "Other Asset", icon: "Package" },
] as const;

export const LIABILITY_TYPES = [
  { value: "Credit Card", label: "Credit Card Debt", icon: "CreditCard" },
  { value: "Personal Loan", label: "Personal Loan", icon: "BadgePercent" },
  { value: "Mortgage", label: "Mortgage", icon: "FileText" },
  { value: "Student Loan", label: "Student Loan", icon: "GraduationCap" },
  { value: "Car Loan", label: "Car Loan", icon: "Car" },
  { value: "Other", label: "Other Liability", icon: "FileWarning" },
] as const;

export type AssetType = typeof ASSET_TYPES[number]['value'];
export type LiabilityType = typeof LIABILITY_TYPES[number]['value'];

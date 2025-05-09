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

export interface AppData {
  assets: Asset[];
  liabilities: Liability[];
  history: NetWorthRecord[];
  financialGoals: string;
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

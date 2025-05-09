import type { LucideProps } from 'lucide-react';
import {
  Wallet, Landmark, LineChart, Home, PiggyBank, Car, TrendingUp, TrendingDown, Package,
  CreditCard, BadgePercent, FileText, GraduationCap, FileWarning, Banknote, HelpCircle, Trash2, Edit3, PlusCircle, Bot, Target, ShieldAlert, DollarSign, PieChart, Settings2, Coins
} from 'lucide-react';

export type IconName = 
  | 'Wallet' | 'Landmark' | 'LineChart' | 'Home' | 'PiggyBank' | 'Car' | 'TrendingUp' | 'TrendingDown' | 'Package'
  | 'CreditCard' | 'BadgePercent' | 'FileText' | 'GraduationCap' | 'FileWarning' | 'Banknote' | 'HelpCircle'
  | 'Trash2' | 'Edit3' | 'PlusCircle' | 'Bot' | 'Target' | 'ShieldAlert' | 'DollarSign' | 'PieChart' | 'Settings2' | 'Coins';

interface IconProps extends LucideProps {
  name: IconName;
}

const Icons: Record<IconName, React.FC<LucideProps>> = {
  Wallet,
  Landmark,
  LineChart,
  Home,
  PiggyBank,
  Car,
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  BadgePercent,
  FileText,
  GraduationCap,
  FileWarning,
  Banknote,
  HelpCircle,
  Trash2,
  Edit3,
  PlusCircle,
  Bot,
  Target,
  ShieldAlert,
  DollarSign,
  PieChart,
  Settings2,
  Coins,
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = Icons[name];
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found. Falling back to HelpCircle.`);
    return <HelpCircle {...props} />; // Fallback icon
  }
  return <LucideIcon {...props} />;
};

import { Calculator, PieChart, Landmark, FileText, LucideIcon, Home, TrendingUp, Wallet, ShieldCheck, Briefcase, PiggyBank, ReceiptText } from "lucide-react"

export type CalculatorInfo = {
    name: string;
    description: string;
    path: string;
    icon: LucideIcon;
};

export const CALCULATORS: CalculatorInfo[] = [
  {
    name: "SIP Calculator",
    description: "Calculate the future value of your monthly investments (SIP).",
    path: "/calculators/sip",
    icon: PieChart,
  },
  {
    name: "Lumpsum Calculator",
    description: "Calculate the future value of a one-time investment.",
    path: "/calculators/lumpsum",
    icon: Landmark,
  },
  {
    name: "FD Calculator",
    description: "Calculate the maturity value of your Fixed Deposit.",
    path: "/calculators/fd",
    icon: PiggyBank,
  },
  {
    name: "PPF Calculator",
    description: "Estimate the maturity value of your PPF investment.",
    path: "/calculators/ppf",
    icon: ShieldCheck,
  },
   {
    name: "SWP Calculator",
    description: "Plan your systematic withdrawals from your investments.",
    path: "/calculators/swp",
    icon: Wallet,
  },
  {
    name: "ROI Calculator",
    description: "Calculate the return on your investment.",
    path: "/calculators/roi",
    icon: TrendingUp,
  },
  {
    name: "EPF Calculator",
    description: "Estimate your Employees' Provident Fund at retirement.",
    path: "/calculators/epf",
    icon: Briefcase,
  },
  {
    name: "EMI Calculator",
    description: "Calculate your Equated Monthly Installment (EMI) for loans.",
    path: "/calculators/emi",
    icon: Calculator,
  },
   {
    name: "Mortgage Calculator",
    description: "Calculate your monthly mortgage payments.",
    path: "/calculators/mortgage",
    icon: Home,
  },
  {
    name: "Loan Calculators",
    description: "Home, car, and personal loan calculators.",
    path: "/calculators/loan",
    icon: Home,
  },
  {
    name: "Income Tax Calculator",
    description: "Estimate your income tax for the financial year.",
    path: "/calculators/tax",
    icon: FileText,
  },
  {
    name: "GST Calculator",
    description: "Calculate Goods and Services Tax (GST) for any amount.",
    path: "/calculators/gst",
    icon: ReceiptText,
  },
];

export const CALCULATORS_MAP = new Map(CALCULATORS.map(calc => [calc.name, calc]));

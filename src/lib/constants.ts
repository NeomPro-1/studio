import { Calculator, PieChart, Landmark, FileText, LucideIcon } from "lucide-react"

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
    name: "EMI Calculator",
    description: "Calculate your Equated Monthly Installment (EMI) for loans.",
    path: "/calculators/emi",
    icon: Calculator,
  },
  {
    name: "Income Tax Calculator",
    description: "Estimate your income tax for the financial year.",
    path: "/calculators/tax",
    icon: FileText,
  },
];

export const CALCULATORS_MAP = new Map(CALCULATORS.map(calc => [calc.name, calc]));

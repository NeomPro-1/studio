import { LoanCalculators } from '@/components/calculators/LoanCalculators';
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';

export default function LoanCalculatorPage() {
  return (
    <CalculatorPageLayout>
      <LoanCalculators />
    </CalculatorPageLayout>
  );
}

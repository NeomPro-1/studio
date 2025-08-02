import { LoanPrepaymentCalculator } from '@/components/calculators/LoanPrepaymentCalculator';
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';

export default function PrepaymentCalculatorPage() {
  return (
    <CalculatorPageLayout>
      <LoanPrepaymentCalculator />
    </CalculatorPageLayout>
  );
}

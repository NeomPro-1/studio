import { GoalPlannerCalculator } from '@/components/calculators/GoalPlannerCalculator';
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';

export default function GoalPlannerPage() {
  return (
    <CalculatorPageLayout>
      <GoalPlannerCalculator />
    </CalculatorPageLayout>
  );
}

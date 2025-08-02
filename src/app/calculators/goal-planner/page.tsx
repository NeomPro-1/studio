
import { GoalPlannerCalculator } from '@/components/calculators/GoalPlannerCalculator';
import { Header } from '@/components/Header';

export default function GoalPlannerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <GoalPlannerCalculator />
        </main>
    </div>
  );
}

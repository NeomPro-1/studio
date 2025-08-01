import { CompoundInterestCalculator } from '@/components/calculators/CompoundInterestCalculator';
import { Header } from '@/components/Header';

export default function CompoundInterestCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <CompoundInterestCalculator />
        </main>
    </div>
  );
}

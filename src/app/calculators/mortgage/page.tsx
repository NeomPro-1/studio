import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';
import { Header } from '@/components/Header';

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <MortgageCalculator />
        </main>
    </div>
  );
}


import { LoanPrepaymentCalculator } from '@/components/calculators/LoanPrepaymentCalculator';
import { Header } from '@/components/Header';

export default function PrepaymentCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <LoanPrepaymentCalculator />
        </main>
    </div>
  );
}

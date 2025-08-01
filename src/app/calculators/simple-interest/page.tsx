import { SimpleInterestCalculator } from '@/components/calculators/SimpleInterestCalculator';
import { Header } from '@/components/Header';

export default function SimpleInterestCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <SimpleInterestCalculator />
        </main>
    </div>
  );
}

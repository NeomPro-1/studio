import { TaxCalculator } from '@/components/calculators/TaxCalculator';
import { Header } from '@/components/Header';

export default function TaxCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <TaxCalculator />
        </main>
    </div>
  );
}

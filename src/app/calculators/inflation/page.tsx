import { InflationCalculator } from '@/components/calculators/InflationCalculator';
import { Header } from '@/components/Header';

export default function InflationCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <InflationCalculator />
        </main>
    </div>
  );
}

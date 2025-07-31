import { EmiCalculator } from '@/components/calculators/EmiCalculator';
import { Header } from '@/components/Header';

export default function EmiCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <EmiCalculator />
        </main>
    </div>
  );
}

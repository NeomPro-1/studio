import { SwpCalculator } from '@/components/calculators/SwpCalculator';
import { Header } from '@/components/Header';

export default function SwpCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <SwpCalculator />
        </main>
    </div>
  );
}

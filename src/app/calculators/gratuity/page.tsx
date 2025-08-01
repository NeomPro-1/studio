import { GratuityCalculator } from '@/components/calculators/GratuityCalculator';
import { Header } from '@/components/Header';

export default function GratuityCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <GratuityCalculator />
        </main>
    </div>
  );
}

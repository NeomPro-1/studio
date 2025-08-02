
import { HlvCalculator } from '@/components/calculators/HlvCalculator';
import { Header } from '@/components/Header';

export default function HlvCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <HlvCalculator />
        </main>
    </div>
  );
}

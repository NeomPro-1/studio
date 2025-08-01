import { XirrCalculator } from '@/components/calculators/XirrCalculator';
import { Header } from '@/components/Header';

export default function XirrCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <XirrCalculator />
        </main>
    </div>
  );
}

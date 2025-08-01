
import { FdCalculator } from '@/components/calculators/FdCalculator';
import { Header } from '@/components/Header';

export default function FdCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <FdCalculator />
        </main>
    </div>
  );
}

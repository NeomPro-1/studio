
import { EpfCalculator } from '@/components/calculators/EpfCalculator';
import { Header } from '@/components/Header';

export default function EpfCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <EpfCalculator />
        </main>
    </div>
  );
}

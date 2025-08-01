
import { PensionCalculator } from '@/components/calculators/PensionCalculator';
import { Header } from '@/components/Header';

export default function PensionCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <PensionCalculator />
        </main>
    </div>
  );
}

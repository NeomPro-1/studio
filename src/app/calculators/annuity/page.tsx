
import { AnnuityCalculator } from '@/components/calculators/AnnuityCalculator';
import { Header } from '@/components/Header';

export default function AnnuityCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <AnnuityCalculator />
        </main>
    </div>
  );
}

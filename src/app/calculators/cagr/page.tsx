import { CagrCalculator } from '@/components/calculators/CagrCalculator';
import { Header } from '@/components/Header';

export default function CagrCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <CagrCalculator />
        </main>
    </div>
  );
}

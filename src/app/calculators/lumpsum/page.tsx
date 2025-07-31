import { LumpsumCalculator } from '@/components/calculators/LumpsumCalculator';
import { Header } from '@/components/Header';

export default function LumpsumCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <LumpsumCalculator />
        </main>
    </div>
  );
}

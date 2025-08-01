import { GstCalculator } from '@/components/calculators/GstCalculator';
import { Header } from '@/components/Header';

export default function GstCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <GstCalculator />
        </main>
    </div>
  );
}

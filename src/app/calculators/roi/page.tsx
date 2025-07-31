import { RoiCalculator } from '@/components/calculators/RoiCalculator';
import { Header } from '@/components/Header';

export default function RoiCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <RoiCalculator />
        </main>
    </div>
  );
}

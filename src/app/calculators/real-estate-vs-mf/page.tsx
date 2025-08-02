
import { RealEstateVsMfCalculator } from '@/components/calculators/RealEstateVsMfCalculator';
import { Header } from '@/components/Header';

export default function RealEstateVsMfCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <RealEstateVsMfCalculator />
        </main>
    </div>
  );
}

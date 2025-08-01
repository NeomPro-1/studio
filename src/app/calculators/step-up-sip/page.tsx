
import { StepUpSipCalculator } from '@/components/calculators/StepUpSipCalculator';
import { Header } from '@/components/Header';

export default function StepUpSipCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <StepUpSipCalculator />
        </main>
    </div>
  );
}

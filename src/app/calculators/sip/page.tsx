import { SipCalculator } from '@/components/calculators/SipCalculator';
import { Header } from '@/components/Header';

export default function SipCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <SipCalculator />
        </main>
    </div>
  );
}

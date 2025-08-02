
import { Calculator } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex items-center justify-center space-x-4">
        <Calculator className="h-12 w-12 text-primary animate-spin" />
        <span className="text-2xl font-semibold text-foreground">Loading Calculator...</span>
      </div>
    </div>
  );
}

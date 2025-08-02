
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutUsPage() {
  return (
    <CalculatorPageLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-headline">About GrowthCalculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to GrowthCalculator, your trusted partner in navigating the world of finance. Our mission is simple: to provide clear, accurate, and easy-to-use financial tools that empower you to make informed decisions about your money.
            </p>
            <p>
              We believe that financial literacy is the key to a secure future. Whether you are planning for retirement, saving for a home, or simply trying to understand your investments, our suite of calculators is designed to give you the insights you need.
            </p>
            <p>
              Thank you for choosing GrowthCalculator. We are committed to helping you on your journey to financial growth.
            </p>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

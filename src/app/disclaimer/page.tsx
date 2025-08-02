import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <CalculatorPageLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-headline">Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The calculators and information provided on GrowthCalculator (the "Service") are intended for informational and educational purposes only. They are not, and should not be considered as, financial, investment, legal, or tax advice.
            </p>
            <p>
              The results presented by the calculators are based on the data you provide and certain assumptions. We do not guarantee the accuracy, completeness, or reliability of any information or calculations. The figures are hypothetical and may not reflect your actual financial situation or future returns. Financial markets are volatile, and investment returns are not guaranteed.
            </p>
            <p>
              Before making any financial decisions, you should consult with a qualified professional, such as a certified financial planner, accountant, or attorney, who can assess your individual circumstances and provide tailored advice.
            </p>
            <p>
              By using this Service, you agree that GrowthCalculator and its creators shall not be held liable for any direct or indirect loss or damage arising from your reliance on the information or calculations provided.
            </p>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

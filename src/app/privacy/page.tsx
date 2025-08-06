
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <CalculatorPageLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-headline">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Your privacy is important to us. It is GrowthCalculator's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            <h3 className="font-semibold text-foreground pt-4">1. Information We Collect</h3>
            <p>
              We want to be crystal clear: **We do not collect or store any personal or financial data you enter into our calculators.** All calculations are performed within your browser, and the data you provide never leaves your device. We do not use cookies for tracking purposes or collect any personally identifiable information.
            </p>
            <h3 className="font-semibold text-foreground pt-4">2. Use of Information</h3>
            <p>
             Since we do not collect any information, we do not use it for any purpose. Your financial calculations are for your eyes only.
            </p>
            <h3 className="font-semibold text-foreground pt-4">3. Third-Party Services</h3>
            <p>
              Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
            </p>
            <h3 className="font-semibold text-foreground pt-4">4. Changes to This Policy</h3>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
            <h3 className="font-semibold text-foreground pt-4">5. Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us.
            </p>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

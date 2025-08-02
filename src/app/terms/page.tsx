
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfUsePage() {
  return (
    <CalculatorPageLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-headline">Terms of Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to GrowthCalculator. By accessing and using our website and services, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully.
            </p>
            <h3 className="font-semibold text-foreground pt-4">1. Acceptance of Agreement</h3>
            <p>
              You agree to the terms and conditions outlined in this Terms of Use Agreement ("Agreement") with respect to our site (the "Site"). This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties, and understandings with respect to the Site.
            </p>
            <h3 className="font-semibold text-foreground pt-4">2. Use of Site</h3>
            <p>
              The calculators, content, and materials on this Site are for your personal, non-commercial use. You are granted a limited, non-exclusive, non-transferable license to use the Site in accordance with this Agreement. You may not copy, reproduce, republish, distribute, display, or transmit any part of the Site without our prior written consent.
            </p>
             <h3 className="font-semibold text-foreground pt-4">3. Disclaimer</h3>
            <p>
              The service, content, and calculators are provided "as-is" and "as available." All warranties, whether express or implied, are disclaimed. The information and calculators may contain bugs, errors, problems, or other limitations. Our liability is limited to the fullest extent permitted by law. Please refer to our separate <a href="/disclaimer" className="text-primary hover:underline">Disclaimer</a> page for more detailed information.
            </p>
             <h3 className="font-semibold text-foreground pt-4">4. Limitation of Liability</h3>
            <p>
              We are not liable for any indirect, special, incidental, or consequential damages (including damages for loss of business, loss of profits, litigation, or the like), whether based on breach of contract, breach of warranty, tort (including negligence), product liability or otherwise, even if advised of the possibility of such damages.
            </p>
             <h3 className="font-semibold text-foreground pt-4">5. Governing Law</h3>
            <p>
              This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the website owner is based, without regard to its conflict of law principles.
            </p>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

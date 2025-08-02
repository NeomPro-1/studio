
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function FaqPage() {
  return (
    <CalculatorPageLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-headline">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is GrowthCalculator?</AccordionTrigger>
                <AccordionContent>
                  GrowthCalculator is a free online resource that provides a suite of financial calculators. Our goal is to empower you to make informed financial decisions by providing tools that are accurate, easy to use, and transparent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are these calculators completely accurate?</AccordionTrigger>
                <AccordionContent>
                  Our calculators are designed and rigorously tested to be highly accurate based on the standard formulas used in the financial industry. However, they are intended for informational and educational purposes only. Results are based on the data you provide and do not account for all personal financial details or future market changes.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Do you store any of my financial data?</AccordionTrigger>
                <AccordionContent>
                  No. We take your privacy very seriously. All calculations are performed directly in your browser. We do not see, store, or track any of the personal or financial information you enter into the calculators.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I use this as financial advice?</AccordionTrigger>
                <AccordionContent>
                  No. The information provided on this website does not constitute financial advice. The calculators are tools to help you understand financial concepts and model potential outcomes. We strongly recommend consulting with a qualified financial advisor before making any significant financial decisions. Please read our full <a href="/disclaimer" className="text-primary hover:underline">Disclaimer</a> for more information.
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-5">
                <AccordionTrigger>How often are the tax slabs and interest rates updated?</AccordionTrigger>
                <AccordionContent>
                 We strive to keep our calculators, especially the Tax and EPF calculators, updated with the latest publicly available information and regulations. However, you should always verify the latest rates with official sources.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </CalculatorPageLayout>
  );
}

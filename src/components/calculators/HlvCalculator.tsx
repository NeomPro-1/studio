
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/formatters';

export function HlvCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [annualIncome, setAnnualIncome] = useState(1000000);
  const [personalExpenses, setPersonalExpenses] = useState(300000);
  const [existingCover, setExistingCover] = useState(500000);
  const [existingInvestments, setExistingInvestments] = useState(1000000);
  const [discountRate, setDiscountRate] = useState(8); // Expected long-term return rate / inflation rate

  const [humanLifeValue, setHumanLifeValue] = useState(0);
  const [requiredCover, setRequiredCover] = useState(0);

  useEffect(() => {
    const workingYears = retirementAge - currentAge;
    const netAnnualContribution = annualIncome - personalExpenses;

    if (workingYears <= 0 || netAnnualContribution <= 0 || discountRate <= 0) {
      setHumanLifeValue(0);
      setRequiredCover(0);
      return;
    }

    const rate = discountRate / 100;
    
    // Using the formula for the present value of a growing annuity (assuming 0% growth for simplicity)
    // PV = C * [1 - (1 + r)^-n] / r
    const pvFactor = (1 - Math.pow(1 + rate, -workingYears)) / rate;
    const calculatedHlv = netAnnualContribution * pvFactor;
    
    setHumanLifeValue(calculatedHlv);
    const calculatedRequiredCover = calculatedHlv - existingInvestments - existingCover;
    setRequiredCover(Math.max(0, calculatedRequiredCover));

  }, [currentAge, retirementAge, annualIncome, personalExpenses, existingCover, existingInvestments, discountRate]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Human Life Value (HLV) Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate the life insurance cover you need to protect your family's future.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Current Age</Label>
                        <Input type="text" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[currentAge]} onValueChange={(vals) => setCurrentAge(vals[0])} min={18} max={59} step={1} />
                    </div>
                     <div className="space-y-2">
                        <Label>Retirement Age</Label>
                        <Input type="text" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[retirementAge]} onValueChange={(vals) => setRetirementAge(vals[0])} min={currentAge + 1} max={70} step={1} />
                    </div>
                     <div className="space-y-2">
                        <Label>Current Annual Income</Label>
                        <Input type="text" value={formatCurrency(annualIncome)} onChange={(e) => setAnnualIncome(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[annualIncome]} onValueChange={(vals) => setAnnualIncome(vals[0])} min={100000} max={10000000} step={50000} />
                    </div>
                    <div className="space-y-2">
                        <Label>Annual Personal Expenses</Label>
                        <Input type="text" value={formatCurrency(personalExpenses)} onChange={(e) => setPersonalExpenses(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[personalExpenses]} onValueChange={(vals) => setPersonalExpenses(vals[0])} min={50000} max={5000000} step={10000} />
                    </div>
                     <div className="space-y-2">
                        <Label>Existing Life Insurance Cover</Label>
                        <Input type="text" value={formatCurrency(existingCover)} onChange={(e) => setExistingCover(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                         <Slider value={[existingCover]} onValueChange={(vals) => setExistingCover(vals[0])} min={0} max={50000000} step={100000} />
                    </div>
                     <div className="space-y-2">
                        <Label>Existing Investments & Savings</Label>
                        <Input type="text" value={formatCurrency(existingInvestments)} onChange={(e) => setExistingInvestments(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[existingInvestments]} onValueChange={(vals) => setExistingInvestments(vals[0])} min={0} max={100000000} step={500000} />
                    </div>
                     <div className="space-y-2">
                        <Label>Discount Rate (%)</Label>
                        <Input type="text" value={discountRate} onChange={(e) => setDiscountRate(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)} className="text-lg font-semibold" />
                        <Slider value={[discountRate]} onValueChange={(vals) => setDiscountRate(vals[0])} min={4} max={12} step={0.1} />
                         <p className="text-xs text-muted-foreground pt-1">Expected return on investments, adjusted for inflation.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Your Human Life Value (HLV)</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(humanLifeValue)}</p>
                        </CardHeader>
                    </Card>
                    <Card className="bg-primary/10">
                        <CardHeader>
                            <CardDescription>Additional Cover Required</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(requiredCover)}</p>
                        </CardHeader>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>About Human Life Value (HLV)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                           Human Life Value (HLV) is a number that represents the total economic value of an individual to their family. It helps you calculate the amount of life insurance you need to ensure your family can maintain their standard of living and achieve their financial goals, even in your absence. By calculating your HLV, you can make an informed decision about the right insurance cover instead of picking an arbitrary amount.
                        </p>
                        <div className="p-4 bg-muted/50 rounded-md">
                            <p className="font-mono text-center text-sm sm:text-base">
                                HLV = Present Value of Future Income - Liabilities
                            </p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li><span className="font-semibold text-foreground">Future Income:</span> Calculates the total income you would earn until retirement, adjusted to its current value (present value).</li>
                            <li><span className="font-semibold text-foreground">Liabilities & Assets:</span> The calculator then subtracts your existing savings and insurance cover to find the exact insurance gap you need to fill.</li>
                            <li><span className="font-semibold text-foreground">Discount Rate:</span> This is a crucial factor, representing the rate at which future earnings should be discounted. A common practice is to use the rate of inflation or the return rate of long-term safe investments.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}


"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Slider } from '@/components/ui/slider';

export function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [finalValue, setFinalValue] = useState(150000);
  const [duration, setDuration] = useState(5);
  
  const [roi, setRoi] = useState(0);
  const [annualizedRoi, setAnnualizedRoi] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  useEffect(() => {
    const profit = finalValue - initialInvestment;
    const totalRoi = initialInvestment > 0 ? (profit / initialInvestment) * 100 : 0;
    
    let annualRoi = 0;
    if (initialInvestment > 0 && finalValue > 0 && duration > 0) {
      annualRoi = (Math.pow(finalValue / initialInvestment, 1 / duration) - 1) * 100;
    }

    setNetProfit(profit);
    setRoi(totalRoi);
    setAnnualizedRoi(annualRoi);
  }, [initialInvestment, finalValue, duration]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">ROI Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate the Return on Investment for your ventures.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="initial-investment">Initial Investment</Label>
                        <Input
                            id="initial-investment"
                            type="text"
                            value={formatCurrency(initialInvestment)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setInitialInvestment(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[initialInvestment]}
                            onValueChange={(vals) => setInitialInvestment(vals[0])}
                            min={1000}
                            max={10000000}
                            step={1000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="final-value">Final Value of Investment</Label>
                        <Input
                            id="final-value"
                            type="text"
                            value={formatCurrency(finalValue)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setFinalValue(value);
                            }}
                            className="text-lg font-semibold"
                        />
                         <Slider
                            value={[finalValue]}
                            onValueChange={(vals) => setFinalValue(vals[0])}
                            min={0}
                            max={20000000}
                            step={1000}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="duration">Duration of Investment (Years)</Label>
                        <Input
                            id="duration"
                            type="text"
                            value={duration}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setDuration(value);
                            }}
                            className="text-lg font-semibold"
                        />
                         <Slider
                            value={[duration]}
                            onValueChange={(vals) => setDuration(vals[0])}
                            min={1}
                            max={40}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Net Profit</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total ROI</CardDescription>
                            <p className="text-2xl font-bold">{formatPercentage(roi)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Annualized ROI</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatPercentage(annualizedRoi)}</p>
                        </CardHeader>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">
                            An initial investment of <span className="font-semibold">{formatCurrency(initialInvestment)}</span> that grew to <span className="font-semibold">{formatCurrency(finalValue)}</span> over <span className="font-semibold">{duration} years</span> yields a net profit of <span className="font-semibold">{formatCurrency(netProfit)}</span>. This represents a total return of <span className="font-semibold">{formatPercentage(roi)}</span> and an annualized return of <span className="font-semibold text-primary">{formatPercentage(annualizedRoi)}</span>.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>About ROI Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Return on Investment (ROI) is a performance measure used to evaluate the efficiency or profitability of an investment. It helps you understand how much profit you have made in relation to your initial cost. This calculator provides both the total ROI over the entire period and the annualized ROI, which gives a clearer picture of yearly performance. It's a fundamental tool for comparing the profitability of different investments.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                        ROI = ((Final Value - Initial Investment) / Initial Investment) * 100
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">Annualized ROI</span> is also calculated to show the yearly rate of return.</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

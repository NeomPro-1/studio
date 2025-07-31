"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import { Slider } from '@/components/ui/slider';

export function RoiCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [finalValue, setFinalValue] = useState(150000);
  
  const [roi, setRoi] = useState(0);
  const [netProfit, setNetProfit] = useState(0);

  useEffect(() => {
    const profit = finalValue - initialInvestment;
    const calculatedRoi = initialInvestment > 0 ? (profit / initialInvestment) * 100 : 0;
    
    setNetProfit(profit);
    setRoi(calculatedRoi);
  }, [initialInvestment, finalValue]);

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
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Net Profit</CardDescription>
                            <CopyToClipboard value={netProfit}>
                                <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Return on Investment (ROI)</CardDescription>
                             <CopyToClipboard value={roi}>
                                <p className="text-2xl font-bold text-primary">{formatPercentage(roi)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">
                            An initial investment of <span className="font-semibold">{formatCurrency(initialInvestment)}</span> that resulted in a final value of <span className="font-semibold">{formatCurrency(finalValue)}</span> yields a net profit of <span className="font-semibold">{formatCurrency(netProfit)}</span> and a total return on investment of <span className="font-semibold text-primary">{formatPercentage(roi)}</span>.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}


"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

export function GoalPlannerCalculator() {
  const [targetAmount, setTargetAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(6);
  const [returnRate, setReturnRate] = useState(12);

  const [futureValue, setFutureValue] = useState(0);
  const [requiredSip, setRequiredSip] = useState(0);

  useEffect(() => {
    // Calculate future value of the goal
    const fv = targetAmount * Math.pow(1 + inflationRate / 100, years);
    setFutureValue(fv);

    // Calculate required monthly SIP
    const monthlyReturnRate = returnRate / 100 / 12;
    const numberOfMonths = years * 12;

    if (monthlyReturnRate > 0) {
      const sip = (fv * monthlyReturnRate) / (Math.pow(1 + monthlyReturnRate, numberOfMonths) - 1);
      setRequiredSip(sip);
    } else {
      setRequiredSip(numberOfMonths > 0 ? fv / numberOfMonths : 0);
    }
  }, [targetAmount, years, inflationRate, returnRate]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Goal-Based Investment Planner</h1>
            <p className="text-muted-foreground mt-2">Plan for your financial goals like a car, wedding, or home down payment.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Goal Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="target-amount">How much does your goal cost today?</Label>
                        <Input
                            id="target-amount"
                            type="text"
                            value={formatCurrency(targetAmount)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setTargetAmount(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[targetAmount]}
                            onValueChange={(vals) => setTargetAmount(vals[0])}
                            min={50000}
                            max={10000000}
                            step={10000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="years">In how many years do you want to achieve this goal?</Label>
                        <Input
                            id="years"
                            type="text"
                            value={years}
                             onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setYears(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[years]}
                            onValueChange={(vals) => setYears(vals[0])}
                            min={1}
                            max={30}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="inflation-rate">Expected Annual Inflation (%)</Label>
                        <Input
                            id="inflation-rate"
                            type="text"
                            value={inflationRate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setInflationRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[inflationRate]}
                            onValueChange={(vals) => setInflationRate(vals[0])}
                            min={1}
                            max={10}
                            step={0.1}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="return-rate">Expected Investment Return Rate (% p.a.)</Label>
                        <Input
                            id="return-rate"
                            type="text"
                            value={returnRate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setReturnRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[returnRate]}
                            onValueChange={(vals) => setReturnRate(vals[0])}
                            min={1}
                            max={20}
                            step={0.5}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                 <Card>
                    <CardHeader className="text-center">
                        <CardDescription>To achieve your goal, you will need</CardDescription>
                        <p className="text-3xl font-bold">{formatCurrency(futureValue)}</p>
                        <p className="text-muted-foreground">after {years} years</p>
                    </CardHeader>
                </Card>
                <Card className="bg-primary/10">
                    <CardHeader className="text-center">
                        <CardDescription>Required Monthly Investment (SIP)</CardDescription>
                        <p className="text-3xl font-bold text-primary">{formatCurrency(requiredSip)}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>About Goal-Based Planning</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                           Goal-based investing is a powerful strategy that aligns your savings with specific life objectives. Instead of just saving money randomly, you define what you're saving for—a new car, a down payment on a house, your child's college education, or a dream vacation. This calculator helps you turn those dreams into an actionable plan.
                        </p>
                        <p>
                           By factoring in the future cost of your goal (adjusted for inflation) and the expected returns from your investments, it calculates the exact Systematic Investment Plan (SIP) amount you need to contribute each month to get there.
                        </p>
                        <div className="p-4 bg-muted/50 rounded-md space-y-2">
                            <p className="font-mono text-center text-sm sm:text-base">
                                Future Value = Present Value × (1 + Inflation Rate) ^ Years
                            </p>
                            <p className="font-mono text-center text-sm sm:text-base">
                                Monthly SIP = Future Value × [ r / ( (1+r)^n - 1 ) ]
                            </p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li><span className="font-semibold text-foreground">Future Value:</span> The estimated cost of your goal in the future.</li>
                            <li><span className="font-semibold text-foreground">Monthly SIP:</span> The amount you need to invest every month.</li>
                            <li><span className="font-semibold text-foreground">r:</span> Monthly rate of return.</li>
                            <li><span className="font-semibold text-foreground">n:</span> Number of months until your goal.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

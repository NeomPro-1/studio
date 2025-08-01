
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, formatLakhs } from '@/lib/formatters';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartConfig = {
    invested: {
      label: "Invested Amount",
      color: "hsl(var(--chart-2))",
    },
    total: {
      label: "Total Value",
      color: "hsl(var(--primary))",
    },
}

export function StepUpSipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [annualIncrease, setAnnualIncrease] = useState(10);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const [totalInvested, setTotalInvested] = useState(0);
  const [estReturns, setEstReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const chartData = useMemo(() => {
    const data = [{ year: 'Year 0', invested: 0, total: 0 }];
    const monthlyRate = returnRate / 100 / 12;
    let futureValue = 0;
    let totalInvestedAmount = 0;
    let currentMonthlyInvestment = monthlyInvestment;

    for (let year = 1; year <= timePeriod; year++) {
      for (let month = 1; month <= 12; month++) {
        futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
        totalInvestedAmount += currentMonthlyInvestment;
      }
      data.push({
        year: `Year ${year}`,
        invested: Math.round(totalInvestedAmount),
        total: Math.round(futureValue),
      });
      // Apply annual increase at the end of the year
      currentMonthlyInvestment *= (1 + annualIncrease / 100);
    }
    return data;
  }, [monthlyInvestment, annualIncrease, returnRate, timePeriod]);

  useEffect(() => {
    const monthlyRate = returnRate / 100 / 12;
    let finalFutureValue = 0;
    let finalTotalInvested = 0;
    let currentMonthlyInvestment = monthlyInvestment;

    for (let year = 0; year < timePeriod; year++) {
      for (let month = 0; month < 12; month++) {
        finalFutureValue += currentMonthlyInvestment * Math.pow(1 + monthlyRate, (timePeriod * 12) - (year * 12 + month));
        finalTotalInvested += currentMonthlyInvestment;
      }
      currentMonthlyInvestment *= (1 + annualIncrease / 100);
    }

    // A more direct calculation for final values
    let finalValue = 0;
    let totalInv = 0;
    let mi = monthlyInvestment;
    for (let year = 1; year <= timePeriod; year++) {
        for (let month = 1; month <= 12; month++) {
            finalValue = (finalValue + mi) * (1 + monthlyRate);
            totalInv += mi;
        }
        mi *= (1 + annualIncrease / 100);
    }

    setTotalValue(finalValue);
    setTotalInvested(totalInv);
    setEstReturns(finalValue - totalInv);
  }, [monthlyInvestment, annualIncrease, returnRate, timePeriod]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Step-up SIP Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate the future value of your investments with an annual increase.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthly-investment">Monthly Investment</Label>
                        <Input
                            id="monthly-investment"
                            type="text"
                            value={formatCurrency(monthlyInvestment)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setMonthlyInvestment(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[monthlyInvestment]}
                            onValueChange={(vals) => setMonthlyInvestment(vals[0])}
                            min={500}
                            max={100000}
                            step={500}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="annual-increase">Annual Increase (%)</Label>
                        <Input
                            id="annual-increase"
                            type="text"
                            value={annualIncrease}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setAnnualIncrease(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[annualIncrease]}
                            onValueChange={(vals) => setAnnualIncrease(vals[0])}
                            min={0}
                            max={25}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="return-rate">Expected Return Rate (% p.a.)</Label>
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
                            max={30}
                            step={0.5}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time-period">Time Period (Years)</Label>
                        <Input
                            id="time-period"
                            type="text"
                            value={timePeriod}
                             onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setTimePeriod(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[timePeriod]}
                            onValueChange={(vals) => setTimePeriod(vals[0])}
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
                            <CardDescription>Invested Amount</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Est. Returns</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(estReturns)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Value</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
                        </CardHeader>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>Wealth Projection</CardTitle>
                        <CardDescription>Projected growth of your investment over {timePeriod} years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1}/>
                                        </linearGradient>
                                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-invested)" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="var(--color-invested)" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatLakhs(value as number)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            formatter={(value, name) => [formatCurrency(value as number), chartConfig[name as keyof typeof chartConfig]?.label]}
                                            labelClassName="font-bold"
                                        />}
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Area type="monotone" dataKey="invested" stackId="1" stroke="var(--color-invested)" fill="url(#colorInvested)" />
                                    <Area type="monotone" dataKey="total" stackId="2" stroke="var(--color-total)" fill="url(#colorTotal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>About Step-up SIP Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    A Step-up SIP is more dynamic than a regular SIP. It allows you to increase your monthly investment amount by a fixed percentage annually, aligning your investments with your growing income and helping you reach financial goals much faster.
                </p>
                <p>
                    For example, you start by investing 5,000 per month in the first year. In the second year, you "step up" your investment by 10%, so you start investing 5,500 per month. In the third year, you increase it again, and so on. This calculator shows the significant impact of making these small, regular increases.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                       This calculator iteratively computes the future value year by year, adjusting the SIP amount annually.
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">Monthly Investment:</span> The initial amount you invest each month.</li>
                    <li><span className="font-semibold text-foreground">Annual Increase:</span> The percentage by which you'll increase your monthly SIP each year.</li>
                    <li><span className="font-semibold text-foreground">Expected Return Rate:</span> The anticipated annual return on your investment.</li>
                    <li><span className="font-semibold text-foreground">Time Period:</span> The total duration of your investment.</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

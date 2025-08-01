
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartConfig = {
    invested: {
      label: "Total Investment",
      color: "hsl(var(--primary))",
    },
    returns: {
      label: "Total Interest",
      color: "hsl(var(--accent))",
    },
}

export function PpfCalculator() {
  const [yearlyInvestment, setYearlyInvestment] = useState(150000);
  const [interestRate, setInterestRate] = useState(7.1);
  const [timePeriod, setTimePeriod] = useState(15);

  const [totalInvested, setTotalInvested] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);
  
  const chartData = useMemo(() => {
    const data = [];
    let futureValue = 0;
    for (let year = 1; year <= timePeriod; year++) {
        futureValue = (futureValue + yearlyInvestment) * (1 + interestRate / 100);
        const invested = yearlyInvestment * year;
        data.push({
            year: `Year ${year}`,
            invested: Math.round(invested),
            returns: Math.round(futureValue - invested),
            total: Math.round(futureValue)
        });
    }
    return data;
  }, [yearlyInvestment, interestRate, timePeriod]);

  useEffect(() => {
    let finalMaturityValue = 0;
    for (let i = 0; i < timePeriod; i++) {
        finalMaturityValue = (finalMaturityValue + yearlyInvestment) * (1 + interestRate / 100);
    }
    
    const finalTotalInvested = yearlyInvestment * timePeriod;
    const finalTotalInterest = finalMaturityValue - finalTotalInvested;

    setMaturityValue(finalMaturityValue);
    setTotalInvested(finalTotalInvested);
    setTotalInterest(finalTotalInterest);

  }, [yearlyInvestment, interestRate, timePeriod]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">PPF Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate the maturity value of your Public Provident Fund investment.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="yearly-investment">Yearly Investment</Label>
                        <Input
                            id="yearly-investment"
                            type="text"
                            value={formatCurrency(yearlyInvestment)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setYearlyInvestment(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[yearlyInvestment]}
                            onValueChange={(vals) => setYearlyInvestment(vals[0])}
                            min={500}
                            max={150000}
                            step={500}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
                        <Input
                            id="interest-rate"
                            type="text"
                            value={interestRate}
                            onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) {
                                    setInterestRate(value);
                                } else {
                                    setInterestRate(0);
                                }
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[interestRate]}
                            onValueChange={(vals) => setInterestRate(vals[0])}
                            min={5}
                            max={10}
                            step={0.1}
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
                            min={15}
                            max={50}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Invested</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Interest</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Maturity Value</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(maturityValue)}</p>
                        </CardHeader>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>Investment Projection</CardTitle>
                        <CardDescription>Year-wise growth of your PPF investment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} stackOffset="sign">
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatLakhs(value as number)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            formatter={(value, name) => [formatCurrency(value as number), chartConfig[name as keyof typeof chartConfig]?.label]}
                                        />}
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="invested" fill="var(--color-invested)" stackId="a" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="returns" fill="var(--color-returns)" stackId="a" radius={[4, 4, 0, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}


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
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartConfig = {
    total: {
      label: "Total Value",
      color: "hsl(var(--primary))",
    },
}

export function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(6);
  const [time, setTime] = useState(5);

  const [maturityValue, setMaturityValue] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const chartData = useMemo(() => {
    const data = [{ year: 'Year 0', total: principal }];
    const yearlyInterest = (principal * rate) / 100;
    for (let year = 1; year <= time; year++) {
        const value = principal + yearlyInterest * year;
        data.push({
            year: `Year ${year}`,
            total: Math.round(value)
        });
    }
    return data;
  }, [principal, rate, time]);

  useEffect(() => {
    const interest = (principal * rate * time) / 100;
    const totalValue = principal + interest;

    setTotalInterest(interest);
    setMaturityValue(totalValue);
  }, [principal, rate, time]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Simple Interest Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate the interest and maturity value of your investment.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="principal">Principal Amount</Label>
                        <Input
                            id="principal"
                            type="text"
                            value={formatCurrency(principal)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setPrincipal(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[principal]}
                            onValueChange={(vals) => setPrincipal(vals[0])}
                            min={1000}
                            max={10000000}
                            step={1000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="return-rate">Interest Rate (% p.a.)</Label>
                        <Input
                            id="return-rate"
                            type="text"
                            value={rate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[rate]}
                            onValueChange={(vals) => setRate(vals[0])}
                            min={1}
                            max={20}
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time-period">Time Period (Years)</Label>
                        <Input
                            id="time-period"
                            type="text"
                            value={time}
                             onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setTime(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[time]}
                            onValueChange={(vals) => setTime(vals[0])}
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
                            <CardDescription>Principal Amount</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(principal)}</p>
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
                        <CardTitle>Investment Growth</CardTitle>
                        <CardDescription>Projected growth of your investment over {time} years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                     <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatLakhs(value as number)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            formatter={(value) => formatCurrency(value as number)}
                                            labelClassName="font-bold"
                                        />}
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Line type="monotone" dataKey="total" stroke="var(--color-total)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>About Simple Interest Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Simple Interest is a quick and easy method to calculate the interest charge on a loan or principal amount. Unlike compound interest, it is calculated only on the principal amount and does not include interest on interest. This calculator is useful for understanding basic loan repayments or returns on simple savings accounts where interest is not compounded.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                        A = P(1 + rt)
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">A:</span> Total Accrued Amount (Principal + Interest)</li>
                    <li><span className="font-semibold text-foreground">P:</span> Principal Amount</li>
                    <li><span className="font-semibold text-foreground">r:</span> Annual Interest Rate (in decimal)</li>
                    <li><span className="font-semibold text-foreground">t:</span> Time Period in Years</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

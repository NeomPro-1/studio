
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const chartConfig = {
    invested: {
      label: "Invested Amount",
      color: "hsl(var(--primary))",
    },
    returns: {
      label: "Est. Returns",
      color: "hsl(var(--accent))",
    },
}

const compoundingFrequencies = {
    'annually': 1,
    'half-yearly': 2,
    'quarterly': 4,
    'monthly': 12,
};

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [returnRate, setReturnRate] = useState(7.1);
  const [timePeriod, setTimePeriod] = useState(5);
  const [compounding, setCompounding] = useState<keyof typeof compoundingFrequencies>('annually');

  const [totalValue, setTotalValue] = useState(0);
  const [estReturns, setEstReturns] = useState(0);

  const chartData = useMemo(() => {
    const data = [];
    const n = compoundingFrequencies[compounding];
    const r = returnRate / 100;
    for (let year = 1; year <= timePeriod; year++) {
        const futureValue = principal * Math.pow(1 + r / n, n * year);
        data.push({
            year: `Year ${year}`,
            invested: principal,
            returns: Math.round(futureValue - principal),
            total: Math.round(futureValue)
        });
    }
    return data;
  }, [principal, returnRate, timePeriod, compounding]);

  useEffect(() => {
    const n = compoundingFrequencies[compounding];
    const r = returnRate / 100;
    const t = timePeriod;
    const totalValueCalc = principal * Math.pow(1 + r / n, n * t);
    const estReturnsCalc = totalValueCalc - principal;

    setTotalValue(totalValueCalc);
    setEstReturns(estReturnsCalc);
  }, [principal, returnRate, timePeriod, compounding]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Compound Interest Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate the future value of your investment with compound interest.</p>
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
                            max={15}
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
                            min={1}
                            max={40}
                            step={1}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Compounding Frequency</Label>
                        <Select value={compounding} onValueChange={(val) => setCompounding(val as keyof typeof compoundingFrequencies)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="annually">Annually</SelectItem>
                                <SelectItem value="half-yearly">Half-yearly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Invested Amount</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(principal)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Interest</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(estReturns)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Maturity Value</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
                        </CardHeader>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>Investment Growth</CardTitle>
                        <CardDescription>Projected growth of your investment over {timePeriod} years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
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
        <Card>
            <CardHeader>
                <CardTitle>About Compound Interest Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. Often called "interest on interest," it is a powerful concept that can make your investments grow much faster than with simple interest. This calculator is essential for anyone looking to understand the long-term growth potential of their savings and investments.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                        A = P (1 + r/n)^(nt)
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">A:</span> Future Value of the Investment/Loan</li>
                    <li><span className="font-semibold text-foreground">P:</span> Principal Amount</li>
                    <li><span className="font-semibold text-foreground">r:</span> Annual Interest Rate (in decimal)</li>
                    <li><span className="font-semibold text-foreground">n:</span> Number of times that interest is compounded per year</li>
                    <li><span className="font-semibold text-foreground">t:</span> Number of years the money is invested or borrowed for</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}


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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

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

type AmortizationData = {
  year: number;
  totalInvestment: number;
  interestEarned: number;
  totalValue: number;
}

export function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const [totalInvested, setTotalInvested] = useState(0);
  const [estReturns, setEstReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const { chartData, amortizationData } = useMemo(() => {
    const chartDataResult = [{ year: 'Year 0', invested: 0, total: 0 }];
    const amortizationDataResult: AmortizationData[] = [];
    
    let futureValue = 0;
    let totalInvestment = 0;
    const i = returnRate / 100 / 12;

    for (let year = 1; year <= timePeriod; year++) {
        let yearlyInvestment = 0;
        for (let month = 1; month <= 12; month++) {
            futureValue = (futureValue + monthlyInvestment) * (1 + i);
            yearlyInvestment += monthlyInvestment;
        }
        totalInvestment += yearlyInvestment;
        
        chartDataResult.push({
            year: `Year ${year}`,
            invested: Math.round(totalInvestment),
            total: Math.round(futureValue)
        });

        amortizationDataResult.push({
          year: year,
          totalInvestment: totalInvestment,
          interestEarned: Math.round(futureValue - totalInvestment),
          totalValue: Math.round(futureValue)
        });
    }
    return { chartData: chartDataResult, amortizationData: amortizationDataResult };
  }, [monthlyInvestment, returnRate, timePeriod]);

  useEffect(() => {
    if (amortizationData.length > 0) {
      const finalData = amortizationData[amortizationData.length - 1];
      setTotalValue(finalData.totalValue);
      setTotalInvested(finalData.totalInvestment);
      setEstReturns(finalData.interestEarned);
    } else {
        const n = timePeriod * 12;
        const totalInvestedCalc = monthlyInvestment * n;
        setTotalValue(totalInvestedCalc);
        setTotalInvested(totalInvestedCalc);
        setEstReturns(0);
    }
  }, [amortizationData, monthlyInvestment, timePeriod]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Mutual Fund (SIP) Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate the future value of your monthly investments.</p>
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
                <CardTitle>Year-wise Amortization</CardTitle>
                <CardDescription>A year-by-year breakdown of your SIP growth.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Year</TableHead>
                                <TableHead>Monthly Investment</TableHead>
                                <TableHead>Total Investment</TableHead>
                                <TableHead>Interest Earned</TableHead>
                                <TableHead className="text-right">Total Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {amortizationData.map((row) => (
                                <TableRow key={row.year}>
                                    <TableCell className="font-medium">{row.year}</TableCell>
                                    <TableCell>{formatCurrency(monthlyInvestment)}</TableCell>
                                    <TableCell>{formatCurrency(row.totalInvestment)}</TableCell>
                                    <TableCell>{formatCurrency(row.interestEarned)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(row.totalValue)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>About SIP Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    A Systematic Investment Plan (SIP) is a disciplined way to invest a fixed amount of money at regular intervals. This calculator helps you project the future value of your SIP investments, demonstrating the power of compounding and consistent saving over time. It's a crucial tool for planning long-term financial goals like retirement, education, or wealth creation.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                        M = P × [((1 + i)^n - 1) / i] × (1+i)
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">M:</span> Future Value (Maturity Amount)</li>
                    <li><span className="font-semibold text-foreground">P:</span> Monthly Investment Amount</li>
                    <li><span className="font-semibold text-foreground">i:</span> Monthly Interest Rate (Annual Rate / 12)</li>
                    <li><span className="font-semibold text-foreground">n:</span> Number of Months (Investment Period in Years × 12)</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

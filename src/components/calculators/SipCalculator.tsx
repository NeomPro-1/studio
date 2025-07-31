"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, formatLakhs } from '@/lib/formatters';
import { CopyToClipboard } from '@/components/CopyToClipboard';
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
      label: "Invested Amount",
      color: "hsl(var(--primary))",
    },
    returns: {
      label: "Est. Returns",
      color: "hsl(var(--accent))",
    },
}

export function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const [totalInvested, setTotalInvested] = useState(0);
  const [estReturns, setEstReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  
  const chartData = useMemo(() => {
    const data = [];
    let currentInvestment = 0;
    for (let year = 1; year <= timePeriod; year++) {
        const i = returnRate / 100 / 12;
        const n = year * 12;
        const futureValue = monthlyInvestment * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
        currentInvestment = monthlyInvestment * n;
        data.push({
            year: `Year ${year}`,
            invested: Math.round(currentInvestment),
            returns: Math.round(futureValue - currentInvestment),
            total: Math.round(futureValue)
        });
    }
    return data;
  }, [monthlyInvestment, returnRate, timePeriod]);

  useEffect(() => {
    const i = returnRate / 100 / 12; // monthly interest rate
    const n = timePeriod * 12; // total number of payments

    const totalValueCalc = monthlyInvestment * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const totalInvestedCalc = monthlyInvestment * n;
    const estReturnsCalc = totalValueCalc - totalInvestedCalc;

    setTotalValue(totalValueCalc);
    setTotalInvested(totalInvestedCalc);
    setEstReturns(estReturnsCalc);
  }, [monthlyInvestment, returnRate, timePeriod]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">SIP Calculator</h1>
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
                            value={formatCurrency(monthlyInvestment)}
                            onChange={(e) => setMonthlyInvestment(Number(e.target.value.replace(/[^0-9]/g, '')))}
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
                        <Label htmlFor="return-rate">Expected Return Rate (p.a.)</Label>
                        <Input 
                            id="return-rate" 
                            value={`${returnRate} %`}
                            onChange={(e) => setReturnRate(Number(e.target.value.replace(/[^0-9.]/g, '')))}
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
                            value={`${timePeriod} Years`}
                            onChange={(e) => setTimePeriod(Number(e.target.value.replace(/[^0-9]/g, '')))}
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
                            <CopyToClipboard value={totalInvested}>
                                <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Est. Returns</CardDescription>
                             <CopyToClipboard value={estReturns}>
                                <p className="text-2xl font-bold">{formatCurrency(estReturns)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Value</CardDescription>
                            <CopyToClipboard value={totalValue}>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</p>
                            </CopyToClipboard>
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
                                <BarChart data={chartData} stackOffset="sign">
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatLakhs(value)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
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
  )
}

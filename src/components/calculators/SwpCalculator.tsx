
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"


const chartConfig = {
    balance: {
      label: "Investment Balance",
      color: "hsl(var(--primary))",
    },
}


export function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(8000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(7);
  const [timePeriod, setTimePeriod] = useState(10);


  const [monthsLasts, setMonthsLasts] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const chartData = useMemo(() => {
    const data = [];
    let balance = totalInvestment;
    const monthlyRate = expectedReturnRate / 100 / 12;

    for (let year = 1; year <= timePeriod; year++) {
        for (let month = 1; month <= 12; month++) {
            balance = balance * (1 + monthlyRate) - withdrawalPerMonth;
        }
        data.push({
            year: `Year ${year}`,
            balance: Math.max(0, balance),
        });
        if (balance <= 0) break;
    }
    return data;
  }, [totalInvestment, withdrawalPerMonth, expectedReturnRate, timePeriod]);


  useEffect(() => {
    const P = totalInvestment;
    const W = withdrawalPerMonth;
    const r = expectedReturnRate / 100 / 12; // Monthly rate of return

    if (P > 0 && W > 0 && r > 0) {
      // Formula to calculate number of months (n)
      // n = -log(1 - (P * r) / W) / log(1 + r)
      const numerator = Math.log(1 - (P * r) / W);
      const denominator = Math.log(1 + r);
      
      if (W <= P * r) {
        setMonthsLasts(Infinity);
        setTotalWithdrawn(Infinity);
        setTotalInterest(Infinity);
      } else {
        const n = -numerator / denominator;
        const totalW = W * n;
        setMonthsLasts(n);
        setTotalWithdrawn(totalW);
        setTotalInterest(totalW - P);
      }
    } else {
        setMonthsLasts(0);
        setTotalWithdrawn(0);
        setTotalInterest(0);
    }
  }, [totalInvestment, withdrawalPerMonth, expectedReturnRate]);

  const formatYearsMonths = (totalMonths: number) => {
    if (totalMonths === Infinity) {
        return "Forever";
    }
    if (isNaN(totalMonths) || totalMonths <= 0) {
        return "0 years 0 months";
    }
    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12);
    return `${years} years ${months} months`;
  };

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">SWP Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate how long your investments will last with regular withdrawals.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="total-investment">Total Investment</Label>
                        <Input
                            id="total-investment"
                            type="text"
                            value={formatCurrency(totalInvestment)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setTotalInvestment(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[totalInvestment]}
                            onValueChange={(vals) => setTotalInvestment(vals[0])}
                            min={50000}
                            max={50000000}
                            step={50000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="withdrawal-per-month">Withdrawal per Month</Label>
                        <Input
                            id="withdrawal-per-month"
                            type="text"
                             value={formatCurrency(withdrawalPerMonth)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setWithdrawalPerMonth(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[withdrawalPerMonth]}
                            onValueChange={(vals) => setWithdrawalPerMonth(vals[0])}
                            min={1000}
                            max={200000}
                            step={1000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="return-rate">Expected Return Rate (% p.a.)</Label>
                        <Input
                            id="return-rate"
                            type="text"
                            value={expectedReturnRate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setExpectedReturnRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[expectedReturnRate]}
                            onValueChange={(vals) => setExpectedReturnRate(vals[0])}
                            min={1}
                            max={20}
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
                            <CardDescription>Your money will last for</CardDescription>
                            <CopyToClipboard value={formatYearsMonths(monthsLasts)}>
                                <p className="text-2xl font-bold text-primary">{formatYearsMonths(monthsLasts)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardDescription>Total Withdrawn</CardDescription>
                             <CopyToClipboard value={totalWithdrawn}>
                                <p className="text-2xl font-bold">{totalWithdrawn === Infinity ? "Infinity" : formatCurrency(totalWithdrawn)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Interest Earned</CardDescription>
                            <CopyToClipboard value={totalInterest}>
                                <p className="text-2xl font-bold">{totalInterest === Infinity ? "Infinity" : formatCurrency(totalInterest)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Investment Balance Over Time</CardTitle>
                        <CardDescription>Projected balance of your investment over {timePeriod} years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-balance)" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="var(--color-balance)" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatLakhs(value as number)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            formatter={(value, name) => [formatCurrency(value as number), 'Balance']}
                                        />}
                                    />
                                    <Area type="monotone" dataKey="balance" stroke="var(--color-balance)" fill="url(#colorBalance)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}


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
  ChartTooltipContent
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const chartConfig = {
    balance: {
      label: "Remaining Balance",
      color: "hsl(var(--primary))",
    },
}

type AmortizationData = {
    year: number;
    openingBalance: number;
    withdrawn: number;
    interestEarned: number;
    closingBalance: number;
}

export function PensionCalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [interestRate, setInterestRate] = useState(7);
  const [payoutYears, setPayoutYears] = useState(20);

  const [monthlyPayout, setMonthlyPayout] = useState(0);
  const [totalPayout, setTotalPayout] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  const { chartData, yearlyAmortization } = useMemo(() => {
    if (monthlyPayout <= 0) {
        return {
            chartData: [{ year: 'Year 0', balance: principal }],
            yearlyAmortization: [],
        };
    }
    
    const chartDataResult = [{ year: 'Year 0', balance: principal }];
    const yearlyAmortizationResult: AmortizationData[] = [];
    let balance = principal;
    const monthlyRate = interestRate / 100 / 12;

    for (let year = 1; year <= payoutYears; year++) {
        const openingBalance = balance;
        let interestForYear = 0;
        let withdrawnForYear = 0;

        for (let month = 1; month <= 12; month++) {
            const interest = balance * monthlyRate;
            interestForYear += interest;
            balance += interest;
            balance -= monthlyPayout;
            withdrawnForYear += monthlyPayout;
        }

        const closingBalance = Math.max(0, balance);
        
        yearlyAmortizationResult.push({
            year,
            openingBalance,
            withdrawn: withdrawnForYear,
            interestEarned: interestForYear,
            closingBalance,
        });

        chartDataResult.push({
            year: `Year ${year}`,
            balance: closingBalance,
        });

        if (balance <= 0) break;
    }
    return { chartData: chartDataResult, yearlyAmortization: yearlyAmortizationResult };
  }, [principal, interestRate, payoutYears, monthlyPayout]);


  useEffect(() => {
    const P = principal;
    const r = interestRate / 100 / 12; // monthly rate
    const n = payoutYears * 12; // number of months

    if (P > 0 && r > 0 && n > 0) {
        const payout = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPaid = payout * n;
        const interestEarned = totalPaid - P;
        
        setMonthlyPayout(payout);
        setTotalPayout(totalPaid);
        setTotalInterest(interestEarned);
    } else {
        setMonthlyPayout(0);
        setTotalPayout(0);
        setTotalInterest(0);
    }

  }, [principal, interestRate, payoutYears]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Pension Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate the monthly pension you can receive from a lump-sum investment.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="principal">Total Investment (Principal)</Label>
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
                            min={100000}
                            max={50000000}
                            step={100000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
                        <Input
                            id="interest-rate"
                            type="text"
                            value={interestRate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setInterestRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[interestRate]}
                            onValueChange={(vals) => setInterestRate(vals[0])}
                            min={1}
                            max={15}
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="payout-years">Payout Period (Years)</Label>
                        <Input
                            id="payout-years"
                             type="text"
                            value={payoutYears}
                             onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setPayoutYears(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[payoutYears]}
                            onValueChange={(vals) => setPayoutYears(vals[0])}
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
                            <CardDescription>Total Interest Earned</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Payout</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(totalPayout)}</p>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardDescription>Monthly Pension</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayout)}</p>
                        </CardHeader>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>Payout Projection</CardTitle>
                        <CardDescription>Projected balance of your investment over {payoutYears} years.</CardDescription>
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
        <Card>
            <CardHeader>
                <CardTitle>Payout Amortization</CardTitle>
                <CardDescription>A year-wise breakdown of your pension plan.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                     <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Year</TableHead>
                                    <TableHead>Opening Balance</TableHead>
                                    <TableHead>Annual Withdrawal</TableHead>
                                    <TableHead>Interest Earned</TableHead>
                                    <TableHead className="text-right">Closing Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {yearlyAmortization.map((row) => (
                                    <TableRow key={row.year}>
                                        <TableCell className="font-medium">{row.year}</TableCell>
                                        <TableCell>{formatCurrency(row.openingBalance)}</TableCell>
                                        <TableCell>{formatCurrency(row.withdrawn)}</TableCell>
                                        <TableCell>{formatCurrency(row.interestEarned)}</TableCell>
                                        <TableCell className="text-right font-semibold">{formatCurrency(row.closingBalance)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="block md:hidden space-y-4 p-2">
                        {yearlyAmortization.map((row) => (
                            <Card key={row.year}>
                                <CardHeader>
                                    <CardTitle>Year {row.year}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Opening Balance:</span> <span className="font-medium">{formatCurrency(row.openingBalance)}</span></div>
                                    <div className="flex justify-between"><span>Annual Withdrawal:</span> <span className="font-medium">{formatCurrency(row.withdrawn)}</span></div>
                                    <div className="flex justify-between"><span>Interest Earned:</span> <span className="font-medium">{formatCurrency(row.interestEarned)}</span></div>
                                    <div className="flex justify-between font-bold text-base"><span>Closing Balance:</span> <span className="font-bold">{formatCurrency(row.closingBalance)}</span></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>About Pension Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    A pension plan (or annuity) is a financial product that provides a stream of regular payments in exchange for a lump-sum investment. This calculator helps you determine the fixed monthly pension you can receive from your investment over a specified period. It is an essential tool for retirement planning, allowing you to see how your savings can be converted into a reliable source of income to cover your living expenses.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                        Monthly Payout = P * [r(1+r)^n] / [(1+r)^n - 1]
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">P:</span> Principal (Total Investment)</li>
                    <li><span className="font-semibold text-foreground">r:</span> Monthly Interest Rate (Annual Rate / 12)</li>
                    <li><span className="font-semibold text-foreground">n:</span> Number of Months (Payout Period in Years × 12)</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}


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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';


const chartConfig = {
    balance: {
      label: "Investment Balance",
      color: "hsl(var(--primary))",
    },
}

type YearlyAmortizationData = {
    year: number;
    openingBalance: number;
    withdrawn: number;
    interestEarned: number;
    closingBalance: number;
}

type MonthlyAmortizationData = {
    month: number;
    openingBalance: number;
    withdrawn: number;
    interestEarned: number;
    closingBalance: number;
}


export function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(8000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(7);
  const [timePeriod, setTimePeriod] = useState(10);


  const [monthsLasts, setMonthsLasts] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  
  const [visibleYears, setVisibleYears] = useState(6);
  const [visibleMonths, setVisibleMonths] = useState(12);


  const { chartData, yearlyAmortization, monthlyAmortization } = useMemo(() => {
    const chartDataResult = [];
    const yearlyAmortizationResult: YearlyAmortizationData[] = [];
    const monthlyAmortizationResult: MonthlyAmortizationData[] = [];

    let balance = totalInvestment;
    const monthlyRate = expectedReturnRate / 100 / 12;

    let monthCounter = 0;
    
    for (let year = 1; year <= timePeriod; year++) {
        const openingBalanceYearly = balance;
        let interestForYear = 0;
        let withdrawnForYear = 0;

        for (let monthInYear = 1; monthInYear <= 12; monthInYear++) {
            if (balance <= 0) break;
            
            monthCounter++;
            const openingBalanceMonthly = balance;
            const interest = balance * monthlyRate;
            interestForYear += interest;
            balance += interest;
            
            const actualWithdrawal = Math.min(balance, withdrawalPerMonth);
            balance -= actualWithdrawal;
            withdrawnForYear += actualWithdrawal;
            
            monthlyAmortizationResult.push({
                month: monthCounter,
                openingBalance: openingBalanceMonthly,
                withdrawn: actualWithdrawal,
                interestEarned: interest,
                closingBalance: balance,
            });
        }
        
        const closingBalanceYearly = Math.max(0, balance);
        
        yearlyAmortizationResult.push({
            year,
            openingBalance: openingBalanceYearly,
            withdrawn: withdrawnForYear,
            interestEarned: interestForYear,
            closingBalance: closingBalanceYearly,
        });

        chartDataResult.push({
            year: `Year ${year}`,
            balance: closingBalanceYearly,
        });

        if (balance <= 0) break;
    }
    return { chartData: chartDataResult, yearlyAmortization: yearlyAmortizationResult, monthlyAmortization: monthlyAmortizationResult };
  }, [totalInvestment, withdrawalPerMonth, expectedReturnRate, timePeriod]);


  useEffect(() => {
    setVisibleYears(6);
    setVisibleMonths(12);
    
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
  
  const displayedYearlyData = yearlyAmortization.slice(0, visibleYears);
  const displayedMonthlyData = monthlyAmortization.slice(0, visibleMonths);
  
  const showMoreYears = () => setVisibleYears(prev => Math.min(prev + 6, yearlyAmortization.length));
  const showLessYears = () => setVisibleYears(prev => Math.max(6, prev - 6));

  const showMoreMonths = () => setVisibleMonths(prev => Math.min(prev + 12, monthlyAmortization.length));
  const showLessMonths = () => setVisibleMonths(prev => Math.max(12, prev - 12));


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
                            <p className="text-2xl font-bold text-primary">{formatYearsMonths(monthsLasts)}</p>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardDescription>Total Withdrawn</CardDescription>
                            <p className="text-2xl font-bold">{totalWithdrawn === Infinity ? "Infinity" : formatCurrency(totalWithdrawn)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Interest Earned</CardDescription>
                            <p className="text-2xl font-bold">{totalInterest === Infinity ? "Infinity" : formatCurrency(totalInterest)}</p>
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
        <Card>
            <CardHeader>
                <CardTitle>Payout Amortization</CardTitle>
                <CardDescription>A breakdown of your SWP.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="yearly" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="yearly">Yearly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="yearly">
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
                                        {displayedYearlyData.map((row) => (
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
                                {displayedYearlyData.map((row) => (
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
                        {yearlyAmortization.length > 6 && (
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <Button variant="outline" onClick={showLessYears} disabled={visibleYears <= 6}>
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    Show Less
                                </Button>
                                <Button variant="outline" onClick={showMoreYears} disabled={visibleYears >= yearlyAmortization.length}>
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Show More
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="monthly">
                        <ScrollArea className="h-96">
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Month</TableHead>
                                            <TableHead>Opening Balance</TableHead>
                                            <TableHead>Withdrawal</TableHead>
                                            <TableHead>Interest Earned</TableHead>
                                            <TableHead className="text-right">Closing Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayedMonthlyData.map((row) => (
                                            <TableRow key={row.month}>
                                                <TableCell className="font-medium">{row.month}</TableCell>
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
                                {displayedMonthlyData.map((row) => (
                                    <Card key={row.month}>
                                        <CardHeader>
                                            <CardTitle>Month {row.month}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Opening Balance:</span> <span className="font-medium">{formatCurrency(row.openingBalance)}</span></div>
                                            <div className="flex justify-between"><span>Withdrawal:</span> <span className="font-medium">{formatCurrency(row.withdrawn)}</span></div>
                                            <div className="flex justify-between"><span>Interest Earned:</span> <span className="font-medium">{formatCurrency(row.interestEarned)}</span></div>
                                            <div className="flex justify-between font-bold text-base"><span>Closing Balance:</span> <span className="font-bold">{formatCurrency(row.closingBalance)}</span></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                        {monthlyAmortization.length > 12 && (
                            <div className="flex justify-center items-center gap-4 mt-4">
                                <Button variant="outline" onClick={showLessMonths} disabled={visibleMonths <= 12}>
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    Show Less
                                </Button>
                                <Button variant="outline" onClick={showMoreMonths} disabled={visibleMonths >= monthlyAmortization.length}>
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    Show More
                                </Button>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>About SWP Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount of money from your investments at regular intervals. This calculator helps you determine how long your invested corpus will last based on your monthly withdrawal needs and the expected rate of return. It is an invaluable tool for retirees or anyone looking to create a steady cash flow from their investments while managing the longevity of their funds.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                        n = -log(1 - (P * r) / W) / log(1 + r)
                    </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">n:</span> Number of Months the Corpus will Last</li>
                    <li><span className="font-semibold text-foreground">P:</span> Principal Investment Amount</li>
                    <li><span className="font-semibold text-foreground">W:</span> Monthly Withdrawal Amount</li>
                    <li><span className="font-semibold text-foreground">r:</span> Monthly Rate of Return</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

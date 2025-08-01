
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/formatters';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const chartConfig = {
    principal: {
      label: "Principal",
      color: "hsl(var(--primary))",
    },
    interest: {
      label: "Interest",
      color: "hsl(var(--accent))",
    },
}

type EmiCalculatorProps = {
    title?: string;
    defaultLoanAmount?: number;
    defaultInterestRate?: number;
    defaultTenure?: number;
}

type AmortizationData = {
    month: number;
    principalPaid: number;
    interestPaid: number;
    totalPayment: number;
    endingBalance: number;
};

export function EmiCalculator({ 
    title = "EMI Calculator",
    defaultLoanAmount = 1000000,
    defaultInterestRate = 8.5,
    defaultTenure = 20
}: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
  const [interestRate, setInterestRate] = useState(defaultInterestRate);
  const [tenure, setTenure] = useState(defaultTenure);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortizationData, setAmortizationData] = useState<AmortizationData[]>([]);

  const chartData = [
    { name: 'principal', value: loanAmount, fill: 'var(--color-principal)' },
    { name: 'interest', value: totalInterest, fill: 'var(--color-interest)'  },
  ];
  
  const yearlyAmortizationData = useMemo(() => {
    if (amortizationData.length === 0) return [];
    
    const yearlyData = [];
    let currentYearData = { year: 1, principalPaid: 0, interestPaid: 0, totalPayment: 0, endingBalance: 0 };
    
    for(let i = 0; i < amortizationData.length; i++) {
        const monthData = amortizationData[i];
        currentYearData.principalPaid += monthData.principalPaid;
        currentYearData.interestPaid += monthData.interestPaid;
        currentYearData.totalPayment += monthData.totalPayment;
        
        if ((i + 1) % 12 === 0 || (i + 1) === amortizationData.length) {
            currentYearData.endingBalance = monthData.endingBalance;
            yearlyData.push(currentYearData);
            currentYearData = { year: yearlyData.length + 1, principalPaid: 0, interestPaid: 0, totalPayment: 0, endingBalance: 0 };
        }
    }
    return yearlyData;
  }, [amortizationData]);

  useEffect(() => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const n = tenure * 12;

    if (principal > 0 && rate > 0 && n > 0) {
      const emiCalc = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      const totalPaymentCalc = emiCalc * n;
      const totalInterestCalc = totalPaymentCalc - principal;

      setEmi(emiCalc);
      setTotalPayment(totalPaymentCalc);
      setTotalInterest(totalInterestCalc);
      
      const schedule: AmortizationData[] = [];
      let balance = principal;
      for (let i = 1; i <= n; i++) {
          const interestPaid = balance * rate;
          const principalPaid = emiCalc - interestPaid;
          balance -= principalPaid;

          schedule.push({
              month: i,
              principalPaid,
              interestPaid,
              totalPayment: emiCalc,
              endingBalance: balance > 0 ? balance : 0,
          });
      }
      setAmortizationData(schedule);

    } else {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
      setAmortizationData([]);
    }
  }, [loanAmount, interestRate, tenure]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">{title}</h1>
            {title === "EMI Calculator" && <p className="text-muted-foreground mt-2">Calculate your Equated Monthly Installment for loans.</p>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="loan-amount">Loan Amount</Label>
                        <Input
                            id="loan-amount"
                            type="text"
                            value={formatCurrency(loanAmount)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setLoanAmount(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[loanAmount]}
                            onValueChange={(vals) => setLoanAmount(vals[0])}
                            min={100000}
                            max={10000000}
                            step={50000}
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
                                if (!isNaN(value)) setInterestRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[interestRate]}
                            onValueChange={(vals) => setInterestRate(vals[0])}
                            min={5}
                            max={20}
                            step={0.1}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                        <Input
                            id="tenure"
                            type="text"
                            value={tenure}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setTenure(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[tenure]}
                            onValueChange={(vals) => setTenure(vals[0])}
                            min={1}
                            max={30}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Monthly EMI</CardDescription>
                            <CopyToClipboard value={emi}>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(emi)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Principal Amount</CardDescription>
                            <CopyToClipboard value={loanAmount}>
                                <p className="text-2xl font-bold">{formatCurrency(loanAmount)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardDescription>Total Interest</CardDescription>
                             <CopyToClipboard value={totalInterest}>
                                <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Payment</CardDescription>
                            <CopyToClipboard value={totalPayment}>
                                <p className="text-2xl font-bold">{formatCurrency(totalPayment)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>Loan Breakdown</CardTitle>
                        <CardDescription>Principal vs. Interest</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                         <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                            >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(value as number)} />}
                                    />
                                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="80%">
                                        {chartData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <ChartLegend
                                        content={<ChartLegendContent nameKey="name" />}
                                        className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Amortization Details</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="yearly">
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
                                            <TableHead>Principal Paid</TableHead>
                                            <TableHead>Interest Paid</TableHead>
                                            <TableHead>Total Payment</TableHead>
                                            <TableHead className="text-right">Ending Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {yearlyAmortizationData.map((row) => (
                                            <TableRow key={row.year}>
                                                <TableCell className="font-medium">{row.year}</TableCell>
                                                <TableCell>{formatCurrency(row.principalPaid)}</TableCell>
                                                <TableCell>{formatCurrency(row.interestPaid)}</TableCell>
                                                <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.endingBalance)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="block md:hidden space-y-4 p-2">
                                {yearlyAmortizationData.map((row) => (
                                    <Card key={row.year}>
                                        <CardHeader>
                                            <CardTitle>Year {row.year}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Principal Paid:</span> <span className="font-medium">{formatCurrency(row.principalPaid)}</span></div>
                                            <div className="flex justify-between"><span>Interest Paid:</span> <span className="font-medium">{formatCurrency(row.interestPaid)}</span></div>
                                            <div className="flex justify-between"><span>Total Payment:</span> <span className="font-medium">{formatCurrency(row.totalPayment)}</span></div>
                                            <div className="flex justify-between font-bold text-base"><span>Ending Balance:</span> <span className="font-bold">{formatCurrency(row.endingBalance)}</span></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="monthly">
                         <ScrollArea className="h-96">
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Month</TableHead>
                                            <TableHead>Principal Paid</TableHead>
                                            <TableHead>Interest Paid</TableHead>
                                            <TableHead>Total Payment</TableHead>
                                            <TableHead className="text-right">Ending Balance</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {amortizationData.map((row) => (
                                            <TableRow key={row.month}>
                                                <TableCell className="font-medium">{row.month}</TableCell>
                                                <TableCell>{formatCurrency(row.principalPaid)}</TableCell>
                                                <TableCell>{formatCurrency(row.interestPaid)}</TableCell>
                                                <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(row.endingBalance)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="block md:hidden space-y-4 p-2">
                                {amortizationData.map((row) => (
                                    <Card key={row.month}>
                                        <CardHeader>
                                            <CardTitle>Month {row.month}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span>Principal Paid:</span> <span className="font-medium">{formatCurrency(row.principalPaid)}</span></div>
                                            <div className="flex justify-between"><span>Interest Paid:</span> <span className="font-medium">{formatCurrency(row.interestPaid)}</span></div>
                                            <div className="flex justify-between"><span>Total Payment:</span> <span className="font-medium">{formatCurrency(row.totalPayment)}</span></div>
                                            <div className="flex justify-between font-bold text-base"><span>Ending Balance:</span> <span className="font-bold">{formatCurrency(row.endingBalance)}</span></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}

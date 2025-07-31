"use client"

import { useState, useEffect } from 'react';
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
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

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
}

export function EmiCalculator({ title = "EMI Calculator" }: EmiCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

  const chartData = [
    { name: 'Principal', value: loanAmount, fill: 'var(--color-principal)' },
    { name: 'Interest', value: totalInterest, fill: 'var(--color-interest)'  },
  ];

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
    } else {
      setEmi(0);
      setTotalPayment(0);
      setTotalInterest(0);
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
                        <Label htmlFor="loan-amount">Loan Amount ({formatCurrency(0, true)})</Label>
                        <Input
                            id="loan-amount"
                            type="text"
                            value={formatCurrency(loanAmount).replace('₹', '')}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
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
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} startAngle={90} endAngle={450}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}

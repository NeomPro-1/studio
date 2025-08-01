
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
    employee: {
      label: "Employee Contribution",
      color: "hsl(var(--primary))",
    },
    employer: {
      label: "Employer Contribution",
      color: "hsl(var(--chart-3))",
    },
    interest: {
      label: "Total Interest",
      color: "hsl(var(--accent))",
    },
}

export function EpfCalculator() {
  const [monthlyBasicSalary, setMonthlyBasicSalary] = useState(50000);
  const [contributionRate] = useState(12);
  const [currentEpfBalance, setCurrentEpfBalance] = useState(500000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge] = useState(60);
  const [annualSalaryIncrease, setAnnualSalaryIncrease] = useState(5);
  const [interestRate, setInterestRate] = useState(8.25);
  
  const [totalContribution, setTotalContribution] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [maturityValue, setMaturityValue] = useState(0);

  const timePeriod = useMemo(() => retirementAge - currentAge, [retirementAge, currentAge]);

  const chartData = useMemo(() => {
    const data = [];
    let balance = currentEpfBalance;
    let salary = monthlyBasicSalary;
    let totalEmployeeContribution = 0;
    let totalEmployerContribution = 0;

    for (let year = 1; year <= timePeriod; year++) {
        const yearlyEmployeeContribution = salary * 12 * (contributionRate / 100);
        const yearlyEmployerContribution = salary * 12 * (contributionRate / 100);
        
        totalEmployeeContribution += yearlyEmployeeContribution;
        totalEmployerContribution += yearlyEmployerContribution;

        const yearlyContribution = yearlyEmployeeContribution + yearlyEmployerContribution;
        balance = (balance + yearlyContribution) * (1 + interestRate / 100);
        
        salary *= (1 + annualSalaryIncrease / 100);
        
        data.push({
            year: `Year ${year + currentAge}`,
            employee: Math.round(totalEmployeeContribution),
            employer: Math.round(totalEmployerContribution),
            interest: Math.round(balance - currentEpfBalance - totalEmployeeContribution - totalEmployerContribution),
            total: Math.round(balance)
        });
    }
    return data;
  }, [monthlyBasicSalary, contributionRate, currentEpfBalance, currentAge, timePeriod, annualSalaryIncrease, interestRate]);

  useEffect(() => {
    let finalBalance = currentEpfBalance;
    let currentSalary = monthlyBasicSalary;
    let finalTotalContribution = 0;

    for (let i = 0; i < timePeriod; i++) {
        const monthlyContribution = currentSalary * (contributionRate / 100);
        const totalMonthlyContribution = monthlyContribution * 2; // Employee + Employer
        const yearlyContribution = totalMonthlyContribution * 12;
        finalBalance = (finalBalance + yearlyContribution) * (1 + interestRate / 100);
        currentSalary *= (1 + annualSalaryIncrease / 100);
        finalTotalContribution += yearlyContribution;
    }
    
    setMaturityValue(finalBalance);
    setTotalContribution(finalTotalContribution);
    setTotalInterest(finalBalance - currentEpfBalance - finalTotalContribution);

  }, [monthlyBasicSalary, contributionRate, currentEpfBalance, currentAge, timePeriod, annualSalaryIncrease, interestRate]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">EPF Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate your Employees' Provident Fund balance at retirement.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthly-salary">Monthly Basic + DA Salary</Label>
                        <Input id="monthly-salary" type="text" value={formatCurrency(monthlyBasicSalary)} onChange={(e) => setMonthlyBasicSalary(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[monthlyBasicSalary]} onValueChange={(vals) => setMonthlyBasicSalary(vals[0])} min={10000} max={200000} step={1000} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="current-balance">Current EPF Balance</Label>
                        <Input id="current-balance" type="text" value={formatCurrency(currentEpfBalance)} onChange={(e) => setCurrentEpfBalance(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[currentEpfBalance]} onValueChange={(vals) => setCurrentEpfBalance(vals[0])} min={0} max={10000000} step={50000} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="current-age">Current Age</Label>
                        <Input id="current-age" type="text" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[currentAge]} onValueChange={(vals) => setCurrentAge(vals[0])} min={18} max={59} step={1} />
                    </div>
                     <div className="space-y-2">
                        <Label>Retirement Age</Label>
                        <Input type="text" value={retirementAge} disabled className="text-lg font-semibold" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salary-increase">Annual Salary Increase (%)</Label>
                        <Input id="salary-increase" type="text" value={annualSalaryIncrease} onChange={(e) => setAnnualSalaryIncrease(parseFloat(e.target.value.replace(/[^0-9.]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[annualSalaryIncrease]} onValueChange={(vals) => setAnnualSalaryIncrease(vals[0])} min={0} max={20} step={0.5} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="interest-rate">EPF Interest Rate (%)</Label>
                        <Input id="interest-rate" type="text" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value.replace(/[^0-9.]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[interestRate]} onValueChange={(vals) => setInterestRate(vals[0])} min={6} max={10} step={0.05} />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Contribution</CardDescription>
                            <CopyToClipboard value={totalContribution}>
                                <p className="text-2xl font-bold">{formatCurrency(totalContribution + currentEpfBalance)}</p>
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
                            <CardDescription>Retirement Corpus</CardDescription>
                            <CopyToClipboard value={maturityValue}>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(maturityValue)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                </div>

                 <Card>
                    <CardHeader>
                        <CardTitle>Retirement Projection</CardTitle>
                        <CardDescription>Breakdown of your EPF growth until age {retirementAge}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} stackOffset="sign">
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => (value as string).replace('Year ', '')} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatLakhs(value as number)} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            formatter={(value, name) => [formatCurrency(value as number), chartConfig[name as keyof typeof chartConfig]?.label]}
                                        />}
                                    />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="employee" fill="var(--color-employee)" stackId="a" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="employer" fill="var(--color-employer)" stackId="a" />
                                    <Bar dataKey="interest" fill="var(--color-interest)" stackId="a" radius={[4, 4, 0, 0]}/>
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

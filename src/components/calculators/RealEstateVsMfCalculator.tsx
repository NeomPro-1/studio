
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, formatLakhs, formatPercentage } from '@/lib/formatters';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const chartConfig = {
    realEstate: {
      label: "Real Estate Net Worth",
      color: "hsl(var(--primary))",
    },
    mutualFund: {
      label: "Mutual Fund Value",
      color: "hsl(var(--accent))",
    },
}

export function RealEstateVsMfCalculator() {
  // Common
  const [timePeriod, setTimePeriod] = useState(20);
  
  // Real Estate
  const [propertyPrice, setPropertyPrice] = useState(5000000);
  const [loanAmount, setLoanAmount] = useState(4000000);
  const [loanInterest, setLoanInterest] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [appreciation, setAppreciation] = useState(6);
  const [maintenance, setMaintenance] = useState(1); // as % of property value per year

  // Mutual Fund
  const [monthlySip, setMonthlySip] = useState(25000);
  const [mfReturn, setMfReturn] = useState(12);
  
  const [realEstateNetWorth, setRealEstateNetWorth] = useState(0);
  const [mutualFundValue, setMutualFundValue] = useState(0);

  const chartData = useMemo(() => {
    const data = [];
    
    // MF Calculation
    const mfMonthlyRate = mfReturn / 100 / 12;
    let currentMfValue = 0;

    // Real Estate Calculation
    const downPayment = propertyPrice - loanAmount;
    const reMonthlyRate = loanInterest / 100 / 12;
    const reMonths = loanTenure * 12;
    const emi = reMonths > 0 ? (loanAmount * reMonthlyRate * Math.pow(1 + reMonthlyRate, reMonths)) / (Math.pow(1 + reMonthlyRate, reMonths) - 1) : 0;
    
    let currentPropertyValue = propertyPrice;
    let outstandingLoan = loanAmount;
    let netEquity = 0;
    
    for (let year = 1; year <= timePeriod; year++) {
      // MF for the year
      for(let month = 1; month <= 12; month++) {
        currentMfValue = (currentMfValue + monthlySip) * (1 + mfMonthlyRate);
      }

      // RE for the year
      currentPropertyValue *= (1 + appreciation / 100);
      const annualRent = monthlyRent * 12;
      const annualMaintenance = currentPropertyValue * (maintenance / 100);
      
      let yearEndLoan = outstandingLoan;
      if (year <= loanTenure) {
        for(let month = 1; month <=12; month++) {
          const interestPaid = yearEndLoan * reMonthlyRate;
          const principalPaid = emi - interestPaid;
          yearEndLoan -= principalPaid;
        }
      } else {
        yearEndLoan = 0;
      }
      outstandingLoan = Math.max(0, yearEndLoan);
      
      netEquity = currentPropertyValue - outstandingLoan;

      data.push({
        year: `Year ${year}`,
        realEstate: Math.round(netEquity),
        mutualFund: Math.round(currentMfValue),
      });
    }

    return data;
  }, [timePeriod, propertyPrice, loanAmount, loanInterest, loanTenure, monthlyRent, appreciation, maintenance, monthlySip, mfReturn]);

  useEffect(() => {
    if (chartData.length > 0) {
      const finalYear = chartData[chartData.length - 1];
      setRealEstateNetWorth(finalYear.realEstate);
      setMutualFundValue(finalYear.mutualFund);
    } else {
      setRealEstateNetWorth(0);
      setMutualFundValue(0);
    }
  }, [chartData]);
  
  const downPayment = useMemo(() => propertyPrice - loanAmount, [propertyPrice, loanAmount]);


  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Real Estate vs. Mutual Fund Comparator</h1>
            <p className="text-muted-foreground mt-2">Compare the potential returns of investing in property vs. a SIP.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Real Estate Investment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Property Price</Label>
                            <Input type="text" value={formatCurrency(propertyPrice)} onChange={(e) => setPropertyPrice(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                            <Slider value={[propertyPrice]} onValueChange={(v) => setPropertyPrice(v[0])} min={1000000} max={50000000} step={100000} />
                        </div>
                        <div className="space-y-2">
                            <Label>Loan Amount</Label>
                            <Input type="text" value={formatCurrency(loanAmount)} onChange={(e) => setLoanAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                            <Slider value={[loanAmount]} onValueChange={(v) => setLoanAmount(v[0])} min={0} max={propertyPrice} step={100000} />
                        </div>
                        <div className="p-2 bg-muted rounded-md text-sm text-center">
                            Down Payment: <span className="font-bold">{formatCurrency(downPayment)}</span>
                        </div>
                        <div className="space-y-2">
                            <Label>Loan Interest Rate (% p.a.)</Label>
                            <Input type="text" value={loanInterest} onChange={(e) => setLoanInterest(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                             <Slider value={[loanInterest]} onValueChange={(v) => setLoanInterest(v[0])} min={6} max={15} step={0.1} />
                        </div>
                        <div className="space-y-2">
                            <Label>Loan Tenure (Years)</Label>
                            <Input type="text" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                            <Slider value={[loanTenure]} onValueChange={(v) => setLoanTenure(v[0])} min={5} max={30} step={1} />
                        </div>
                        <div className="space-y-2">
                            <Label>Monthly Rental Income</Label>
                            <Input type="text" value={formatCurrency(monthlyRent)} onChange={(e) => setMonthlyRent(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                             <Slider value={[monthlyRent]} onValueChange={(v) => setMonthlyRent(v[0])} min={0} max={200000} step={1000} />
                        </div>
                        <div className="space-y-2">
                            <Label>Property Appreciation (% p.a.)</Label>
                            <Input type="text" value={appreciation} onChange={(e) => setAppreciation(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                             <Slider value={[appreciation]} onValueChange={(v) => setAppreciation(v[0])} min={0} max={20} step={0.5} />
                        </div>
                        <div className="space-y-2">
                            <Label>Annual Maintenance (% of property value)</Label>
                            <Input type="text" value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                             <Slider value={[maintenance]} onValueChange={(v) => setMaintenance(v[0])} min={0} max={5} step={0.1} />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Mutual Fund Investment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            <Label>Monthly SIP Amount</Label>
                            <Input type="text" value={formatCurrency(monthlySip)} onChange={(e) => setMonthlySip(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                            <Slider value={[monthlySip]} onValueChange={(v) => setMonthlySip(v[0])} min={1000} max={200000} step={1000} />
                        </div>
                        <div className="space-y-2">
                            <Label>Expected Return Rate (% p.a.)</Label>
                            <Input type="text" value={mfReturn} onChange={(e) => setMfReturn(Number(e.target.value.replace(/[^0-9.]/g, '')))} />
                             <Slider value={[mfReturn]} onValueChange={(v) => setMfReturn(v[0])} min={5} max={25} step={0.5} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Investment Horizon</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <div className="space-y-2">
                            <Label>Comparison Period (Years)</Label>
                            <Input type="text" value={timePeriod} onChange={(e) => setTimePeriod(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                             <Slider value={[timePeriod]} onValueChange={(v) => setTimePeriod(v[0])} min={5} max={30} step={1} />
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>Real Estate Net Worth</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(realEstateNetWorth)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Mutual Fund Value</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(mutualFundValue)}</p>
                        </CardHeader>
                    </Card>
                </div>
                 <Card className={mutualFundValue > realEstateNetWorth ? "bg-accent/20 border-accent" : "bg-primary/10 border-primary"}>
                    <CardHeader className="text-center">
                        <CardTitle>The Winner Is...</CardTitle>
                        <p className="text-3xl font-bold">{mutualFundValue > realEstateNetWorth ? 'Mutual Funds' : 'Real Estate'}</p>
                        <p className="text-muted-foreground">with a difference of {formatCurrency(Math.abs(mutualFundValue - realEstateNetWorth))}</p>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Comparative Growth</CardTitle>
                        <CardDescription>Projected growth over {timePeriod} years.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
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
                                    <Line type="monotone" dataKey="realEstate" stroke="var(--color-realEstate)" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="mutualFund" stroke="var(--color-mutualFund)" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

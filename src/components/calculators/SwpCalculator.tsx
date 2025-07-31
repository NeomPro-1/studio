
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/formatters';
import { CopyToClipboard } from '@/components/CopyToClipboard';

export function SwpCalculator() {
  const [totalInvestment, setTotalInvestment] = useState(1000000);
  const [withdrawalPerMonth, setWithdrawalPerMonth] = useState(8000);
  const [expectedReturnRate, setExpectedReturnRate] = useState(7);

  const [monthsLasts, setMonthsLasts] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

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
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">
                            With an initial investment of <span className="font-semibold">{formatCurrency(totalInvestment)}</span> and monthly withdrawals of <span className="font-semibold">{formatCurrency(withdrawalPerMonth)}</span>, assuming an annual return of <span className="font-semibold">{expectedReturnRate}%</span>, your funds are projected to last for <span className="font-semibold text-primary">{formatYearsMonths(monthsLasts)}</span>.
                            {monthsLasts !== Infinity && ` During this period, you will have withdrawn a total of ${formatCurrency(totalWithdrawn)}.`}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

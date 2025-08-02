
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [investmentRate, setInvestmentRate] = useState(10);
  const [timePeriod, setTimePeriod] = useState(10);
  
  const [futureCost, setFutureCost] = useState(0);
  const [investmentValue, setInvestmentValue] = useState(0);
  const [netGain, setNetGain] = useState(0);

  useEffect(() => {
    const iRate = inflationRate / 100;
    const rRate = investmentRate / 100;
    const years = timePeriod;
    
    // What an item costing `currentAmount` today would cost in the future
    const calculatedFutureCost = currentAmount * Math.pow(1 + iRate, years);
    setFutureCost(calculatedFutureCost);

    // What `currentAmount` would grow to if invested
    const calculatedInvestmentValue = currentAmount * Math.pow(1 + rRate, years);
    setInvestmentValue(calculatedInvestmentValue);

    // The real purchasing power gain after accounting for future costs
    const calculatedNetGain = calculatedInvestmentValue - calculatedFutureCost;
    setNetGain(calculatedNetGain);

  }, [currentAmount, inflationRate, investmentRate, timePeriod]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Inflation vs. Investment Calculator</h1>
            <p className="text-muted-foreground mt-2">See how investing can help your money outpace inflation.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="current-amount">Initial Amount</Label>
                        <Input
                            id="current-amount"
                            type="text"
                            value={formatCurrency(currentAmount)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setCurrentAmount(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[currentAmount]}
                            onValueChange={(vals) => setCurrentAmount(vals[0])}
                            min={10000}
                            max={10000000}
                            step={10000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="investment-rate">Expected Annual Investment Return (%)</Label>
                        <Input
                            id="investment-rate"
                            type="text"
                            value={investmentRate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setInvestmentRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[investmentRate]}
                            onValueChange={(vals) => setInvestmentRate(vals[0])}
                            min={1}
                            max={20}
                            step={0.5}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="inflation-rate">Expected Annual Inflation Rate (%)</Label>
                        <Input
                            id="inflation-rate"
                            type="text"
                            value={inflationRate}
                             onChange={(e) => {
                                const value = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
                                if (!isNaN(value)) setInflationRate(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[inflationRate]}
                            onValueChange={(vals) => setInflationRate(vals[0])}
                            min={1}
                            max={15}
                            step={0.1}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <Card>
                        <CardHeader>
                           <div className="flex items-center justify-center gap-2">
                             <TrendingDown className="h-6 w-6 text-destructive" />
                             <CardDescription>Future Cost of Goods</CardDescription>
                           </div>
                            <p className="text-2xl font-bold">{formatCurrency(futureCost)}</p>
                            <p className="text-xs text-muted-foreground">({formatCurrency(currentAmount)} adjusted for inflation)</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                           <div className="flex items-center justify-center gap-2">
                             <TrendingUp className="h-6 w-6 text-green-600" />
                             <CardDescription>Future Value of Investment</CardDescription>
                           </div>
                            <p className="text-2xl font-bold">{formatCurrency(investmentValue)}</p>
                             <p className="text-xs text-muted-foreground">({formatCurrency(currentAmount)} invested at {formatPercentage(investmentRate)})</p>
                        </CardHeader>
                    </Card>
                </div>
                 <Card className="bg-primary/10">
                    <CardHeader className="text-center">
                        <CardDescription>Your Net Gain in Purchasing Power</CardDescription>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(netGain)}</p>
                        <p className="text-muted-foreground mt-2">This is the real growth of your wealth after accounting for inflation.</p>
                    </CardHeader>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>About the Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                           Inflation is the rate at which prices rise, causing the purchasing power of your money to fall. This calculator demonstrates this "silent thief" in action, but more importantly, it shows you the solution: **investing**.
                        </p>
                        <p>
                           An item that costs {formatCurrency(currentAmount)} today will cost <span className="font-bold">{formatCurrency(futureCost)}</span> in {timePeriod} years, assuming {formatPercentage(inflationRate)} inflation. If you just save your {formatCurrency(currentAmount)} in cash, you won't be able to afford that item in the future.
                        </p>
                        <p>
                           If you invest that same {formatCurrency(currentAmount)} at an expected return of {formatPercentage(investmentRate)}, it could grow to <span className="font-bold">{formatCurrency(investmentValue)}</span> in {timePeriod} years. After buying that same item for its future price of {formatCurrency(futureCost)}, you would still have <span className="font-bold text-primary">{formatCurrency(netGain)}</span> left over. This is how you build real wealth.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

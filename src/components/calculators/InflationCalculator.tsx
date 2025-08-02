
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/formatters';
import { TrendingDown } from 'lucide-react';

export function InflationCalculator() {
  const [currentAmount, setCurrentAmount] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6);
  const [timePeriod, setTimePeriod] = useState(10);
  
  const [futureValue, setFutureValue] = useState(0);
  const [purchasingPower, setPurchasingPower] = useState(0);

  useEffect(() => {
    const rate = inflationRate / 100;
    const years = timePeriod;
    
    // The future value is just the current amount, as we are calculating the loss of its value
    setFutureValue(currentAmount);

    // Calculate the purchasing power of the current amount in the future
    const power = currentAmount / Math.pow(1 + rate, years);
    setPurchasingPower(power);

  }, [currentAmount, inflationRate, timePeriod]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Inflation Impact Calculator</h1>
            <p className="text-muted-foreground mt-2">See how the value of your money erodes over time due to inflation.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="current-amount">Current Amount of Money</Label>
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
                <Card>
                    <CardHeader className="text-center">
                        <CardDescription>In {timePeriod} years, your {formatCurrency(futureValue)} will have the same purchasing power as</CardDescription>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(purchasingPower)}</p>
                        <CardDescription>in today's terms.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <TrendingDown className="h-16 w-16 text-destructive/80 my-4" />
                        <p className="text-lg">
                           This represents a <span className="font-bold text-destructive">{formatCurrency(futureValue - purchasingPower)} ({(((futureValue - purchasingPower)/futureValue)*100).toFixed(2)}%)</span> loss in value due to inflation.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>About the Inflation Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                           Inflation is the rate at which the general level of prices for goods and services rises, which means the purchasing power of your money falls. Think of it as a 'silent thief' that slowly eats away at the value of your savings.
                        </p>
                        <p className="font-semibold">Here is a simple example:</p>
                        <p>
                            Imagine something costs {formatCurrency(purchasingPower)} today. With {inflationRate}% annual inflation, in {timePeriod} years, you would need {formatCurrency(futureValue)} to buy the exact same thing. This calculator shows you this exact effect on your savings.
                        </p>
                        <p className="font-semibold">How do you stay profitable?</p>
                        <p>
                          The key to overcoming inflation is to invest your money in assets that are expected to generate returns higher than the inflation rate. If inflation is 6%, but your investments are growing at 10%, you are not just preserving your wealth—you are increasing your purchasing power by 4% every year. This is how you build real wealth.
                        </p>
                        <div className="p-4 bg-muted/50 rounded-md">
                            <p className="font-mono text-center text-sm sm:text-base">
                                Purchasing Power = Current Amount / (1 + Inflation Rate) ^ Years
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Slider } from '@/components/ui/slider';

export function CagrCalculator() {
  const [initialValue, setInitialValue] = useState(100000);
  const [finalValue, setFinalValue] = useState(200000);
  const [duration, setDuration] = useState(5);
  
  const [cagr, setCagr] = useState(0);
  const [absoluteReturn, setAbsoluteReturn] = useState(0);
  const [netGrowth, setNetGrowth] = useState(0);

  useEffect(() => {
    const growth = finalValue - initialValue;
    const absReturn = initialValue > 0 ? (growth / initialValue) * 100 : 0;
    
    let cagrValue = 0;
    if (initialValue > 0 && finalValue > 0 && duration > 0) {
      cagrValue = (Math.pow(finalValue / initialValue, 1 / duration) - 1) * 100;
    }

    setNetGrowth(growth);
    setAbsoluteReturn(absReturn);
    setCagr(cagrValue);
  }, [initialValue, finalValue, duration]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">CAGR Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate the Compound Annual Growth Rate of your investment.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="initial-value">Initial Investment Value</Label>
                        <Input
                            id="initial-value"
                            type="text"
                            value={formatCurrency(initialValue)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setInitialValue(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[initialValue]}
                            onValueChange={(vals) => setInitialValue(vals[0])}
                            min={1000}
                            max={10000000}
                            step={1000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="final-value">Final Investment Value</Label>
                        <Input
                            id="final-value"
                            type="text"
                            value={formatCurrency(finalValue)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setFinalValue(value);
                            }}
                            className="text-lg font-semibold"
                        />
                         <Slider
                            value={[finalValue]}
                            onValueChange={(vals) => setFinalValue(vals[0])}
                            min={0}
                            max={20000000}
                            step={1000}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="duration">Investment Duration (Years)</Label>
                        <Input
                            id="duration"
                            type="text"
                            value={duration}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setDuration(value);
                            }}
                            className="text-lg font-semibold"
                        />
                         <Slider
                            value={[duration]}
                            onValueChange={(vals) => setDuration(vals[0])}
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
                            <CardDescription>Net Growth</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(netGrowth)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Absolute Return</CardDescription>
                            <p className="text-2xl font-bold">{formatPercentage(absoluteReturn)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>CAGR</CardDescription>
                            <p className="text-2xl font-bold text-primary">{formatPercentage(cagr)}</p>
                        </CardHeader>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center">
                            An initial investment of <span className="font-semibold">{formatCurrency(initialValue)}</span> growing to <span className="font-semibold">{formatCurrency(finalValue)}</span> over <span className="font-semibold">{duration} years</span> has a Compound Annual Growth Rate (CAGR) of <span className="font-semibold text-primary">{formatPercentage(cagr)}</span>.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

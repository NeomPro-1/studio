
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type CashFlow = {
  id: number;
  amount: number;
  date: Date;
};

// Simplified XIRR calculation using Newton-Raphson method
function calculateXIRR(cashFlows: { amount: number; date: Date }[]): number {
  if (cashFlows.length < 2) return 0;

  const validFlows = cashFlows.filter(cf => cf.date && !isNaN(cf.amount) && cf.amount !== 0);
  if (validFlows.length < 2) return 0;
  
  let hasPositive = false;
  let hasNegative = false;
  for(const flow of validFlows) {
      if(flow.amount > 0) hasPositive = true;
      if(flow.amount < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) return 0;

  validFlows.sort((a, b) => a.date.getTime() - b.date.getTime());

  const firstDate = validFlows[0].date;

  const npv = (rate: number): number => {
    return validFlows.reduce((acc, { amount, date }) => {
      const days = (date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      return acc + amount / Math.pow(1 + rate, days / 365.0);
    }, 0);
  };
  
  const derivative = (rate: number): number => {
    return validFlows.reduce((acc, { amount, date }) => {
       const days = (date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
       if (days === 0) return acc;
       return acc - (amount * days / 365.0) / Math.pow(1 + rate, (days / 365.0) + 1);
    }, 0);
  };

  let guess = 0.1;
  const maxIterations = 100;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    const value = npv(guess);
    const deriv = derivative(guess);
    
    if (Math.abs(deriv) < 1e-9) break;

    const newGuess = guess - value / deriv;
    
    if (Math.abs(newGuess - guess) < tolerance) {
      return newGuess * 100;
    }
    guess = newGuess;
  }
  return NaN; // Indicate failure
}


export function XirrCalculator() {
  const today = new Date();
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { id: 1, amount: -100000, date: new Date(today.getFullYear() -1, today.getMonth(), today.getDate()) },
    { id: 2, amount: 20000, date: new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()) },
    { id: 3, amount: 30000, date: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()) },
    { id: 4, amount: 65000, date: today },
  ]);
  const [xirr, setXirr] = useState(0);

  const { netProfit, totalInvestment, totalReturn, totalRoi } = useMemo(() => {
    let investment = 0;
    let returns = 0;
    cashFlows.forEach(flow => {
        if (flow.amount < 0) {
            investment += Math.abs(flow.amount);
        } else {
            returns += flow.amount;
        }
    });
    const profit = returns - investment;
    const roi = investment > 0 ? (profit / investment) * 100 : 0;
    return { netProfit: profit, totalInvestment: investment, totalReturn: returns, totalRoi: roi };
  }, [cashFlows]);

  useEffect(() => {
    const result = calculateXIRR(cashFlows);
    setXirr(isNaN(result) ? 0 : result);
  }, [cashFlows]);

  const addRow = () => {
    setCashFlows([...cashFlows, { id: Date.now(), amount: 0, date: new Date() }]);
  };

  const removeRow = (id: number) => {
    setCashFlows(cashFlows.filter(flow => flow.id !== id));
  };
  
  const updateRow = (id: number, field: 'amount' | 'date', value: number | Date) => {
    setCashFlows(
      cashFlows.map(flow => (flow.id === id ? { ...flow, [field]: value } : flow))
    );
  };
  
  const handleAmountChange = (id: number, value: string) => {
    let newAmount = 0;
    const isNegative = value.startsWith('-');
    const numericString = value.replace(/[^0-9]/g, '');
    
    if (numericString) {
      newAmount = parseInt(numericString, 10);
      if (isNegative) {
        newAmount = -newAmount;
      }
    }
    
    updateRow(id, 'amount', newAmount);
  };

  const displayAmount = (amount: number) => {
    if (amount === 0) return '';
    const formatted = formatCurrency(Math.abs(amount));
    return amount < 0 ? `-${formatted}` : formatted;
  };

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">XIRR Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate the Extended Internal Rate of Return for irregular cash flows.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cash Flows</CardTitle>
                        <CardDescription>Enter your series of cash flows. Use negative values for investments/outflows.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 items-center font-medium px-2">
                            <div className="col-span-6"><Label>Amount</Label></div>
                            <div className="col-span-5"><Label>Date</Label></div>
                        </div>
                        {cashFlows.map((flow) => (
                            <div key={flow.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-6">
                                <Input
                                    type="text"
                                    value={displayAmount(flow.amount)}
                                    onChange={(e) => handleAmountChange(flow.id, e.target.value)}
                                    placeholder="e.g., -100,000 or 500"
                                    className="text-base"
                                />
                            </div>
                            <div className="col-span-5">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !flow.date && "text-muted-foreground"
                                        )}
                                    >
                                        {flow.date ? format(flow.date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={flow.date}
                                        onSelect={(date) => date && updateRow(flow.id, 'date', date)}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="col-span-1">
                                <Button variant="ghost" size="icon" onClick={() => removeRow(flow.id)} disabled={cashFlows.length <= 2}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                            </div>
                        ))}
                        <Button onClick={addRow} variant="outline" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Cash Flow
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardDescription>Net Profit</CardDescription>
                        <p className="text-2xl font-bold">{formatCurrency(netProfit)}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="text-center">
                        <CardDescription>Total ROI</CardDescription>
                        <p className="text-2xl font-bold">{formatPercentage(totalRoi)}</p>
                    </CardHeader>
                </Card>
                <Card className="bg-primary/10">
                    <CardHeader className="text-center">
                        <CardTitle>XIRR</CardTitle>
                        <p className="text-3xl font-bold text-primary">{formatPercentage(xirr)}</p>
                         <p className="text-muted-foreground mt-1 text-sm">Annualized Rate of Return</p>
                    </CardHeader>
                </Card>
            </div>
        </div>
    </div>
  );
}

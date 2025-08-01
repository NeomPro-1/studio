
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/formatters';
import { CopyToClipboard } from '@/components/CopyToClipboard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const gstRates = ["3", "5", "12", "18", "28"];

export function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState("18");
  const [gstType, setGstType] = useState('exclusive');

  const [netAmount, setNetAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const rate = parseFloat(gstRate) / 100;
    if (isNaN(rate)) return;

    if (gstType === 'exclusive') {
      const gst = amount * rate;
      setNetAmount(amount);
      setGstAmount(gst);
      setTotalAmount(amount + gst);
    } else { // inclusive
      const baseAmount = amount / (1 + rate);
      const gst = amount - baseAmount;
      setNetAmount(baseAmount);
      setGstAmount(gst);
      setTotalAmount(amount);
    }
  }, [amount, gstRate, gstType]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(value)) {
      setAmount(value);
    }
  };
  
  const handleRateChange = (value: string) => {
    setGstRate(value);
  }

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">GST Calculator</h1>
            <p className="text-muted-foreground mt-2">Calculate Goods and Services Tax.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="text"
                            value={formatCurrency(amount)}
                            onChange={handleAmountChange}
                            className="text-lg font-semibold"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>GST Calculation</Label>
                        <RadioGroup value={gstType} onValueChange={setGstType} className="flex space-x-4 pt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="exclusive" id="exclusive" />
                                <Label htmlFor="exclusive">Exclusive</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="inclusive" id="inclusive" />
                                <Label htmlFor="inclusive">Inclusive</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gst-rate">GST Rate (%)</Label>
                        <Select value={gstRate} onValueChange={handleRateChange}>
                            <SelectTrigger id="gst-rate">
                                <SelectValue placeholder="Select GST Rate" />
                            </SelectTrigger>
                            <SelectContent>
                                {gstRates.map(rate => (
                                    <SelectItem key={rate} value={rate}>{rate}%</SelectItem>
                                ))}
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                        {gstRate === 'custom' && (
                             <Input
                                id="custom-gst-rate"
                                type="text"
                                placeholder="Enter custom rate"
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9.]/g, '');
                                    setGstRate(value);
                                }}
                                className="text-lg font-semibold mt-2"
                            />
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <Card>
                        <CardHeader>
                            <CardDescription>{gstType === 'inclusive' ? 'Pre-GST Amount' : 'Net Amount'}</CardDescription>
                            <CopyToClipboard value={netAmount}>
                                <p className="text-2xl font-bold">{formatCurrency(netAmount)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>GST Amount</CardDescription>
                             <CopyToClipboard value={gstAmount}>
                                <p className="text-2xl font-bold">{formatCurrency(gstAmount)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardDescription>Total Amount</CardDescription>
                            <CopyToClipboard value={totalAmount}>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                            </CopyToClipboard>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}

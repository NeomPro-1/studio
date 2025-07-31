
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/formatters';
import { CopyToClipboard } from '@/components/CopyToClipboard';

// As of Budget 2023, the new tax regime is the default.
const oldSlabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

const newSlabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

const calculateTax = (income: number, slabs: typeof oldSlabs) => {
    let tax = 0;
    let taxableIncome = income;
    let lastLimit = 0;

    for (const slab of slabs) {
        if (taxableIncome <= 0) break;

        const taxableInSlab = Math.min(taxableIncome, slab.limit - lastLimit);
        tax += taxableInSlab * slab.rate;
        taxableIncome -= taxableInSlab;
        lastLimit = slab.limit;

        if (slab.limit === Infinity) {
            tax += taxableIncome * slab.rate;
            break;
        }
    }

    return tax;
};


export function TaxCalculator() {
  const [income, setIncome] = useState(1000000);
  const [deductions, setDeductions] = useState(150000);
  const [taxRegime, setTaxRegime] = useState('new');
  
  const [taxPayable, setTaxPayable] = useState(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);

  useEffect(() => {
    let taxableIncome;
    let slabs;
    
    if (taxRegime === 'old') {
      taxableIncome = Math.max(0, income - deductions);
      slabs = oldSlabs;
      let tax = calculateTax(taxableIncome, slabs);
      // Rebate under 87A for old regime
      if (taxableIncome <= 500000) {
        tax = 0;
      }
      const cess = tax * 0.04;
      const totalTax = tax > 0 ? tax + cess : 0;
      setTaxPayable(totalTax);
      setEffectiveTaxRate(totalTax > 0 ? (totalTax / income) * 100 : 0);

    } else { // New Regime
      taxableIncome = Math.max(0, income - 50000); // Standard deduction
      slabs = newSlabs;
      let tax = calculateTax(taxableIncome, slabs);
       // Rebate under 87A for new regime
      if (income <= 700000) {
          tax = 0;
      }
      const cess = tax * 0.04;
      const totalTax = tax > 0 ? tax + cess : 0;
      setTaxPayable(totalTax);
      setEffectiveTaxRate(totalTax > 0 ? (totalTax / income) * 100 : 0);
    }
  }, [income, deductions, taxRegime]);

  const taxableIncomeDisplay = taxRegime === 'old' 
    ? Math.max(0, income - deductions) 
    : Math.max(0, income - 50000);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Income Tax Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate your income tax for the financial year.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Your Income & Deductions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="income">Annual Income (from salary)</Label>
                        <Input
                            id="income"
                            type="text"
                            value={formatCurrency(income)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setIncome(value);
                            }}
                            className="text-lg font-semibold"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deductions">Total Deductions (e.g., 80C, 80D)</Label>
                        <Input
                            id="deductions"
                            type="text"
                            value={formatCurrency(deductions)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setDeductions(value);
                            }}
                            className="text-lg font-semibold"
                            disabled={taxRegime === 'new'}
                        />
                    </div>
                     <div className="space-y-3">
                        <Label>Tax Regime</Label>
                        <RadioGroup value={taxRegime} onValueChange={setTaxRegime} className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="new" id="new-regime" />
                                <Label htmlFor="new-regime">New Regime (Default)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="old" id="old-regime" />
                                <Label htmlFor="old-regime">Old Regime</Label>
                            </div>
                        </RadioGroup>
                        <p className="text-xs text-muted-foreground">
                            The new tax regime is now the default option. You can opt for the old regime if it's more beneficial. A standard deduction of ₹50,000 is available in the new regime.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Tax Calculation</CardTitle>
                        <CardDescription>Based on the {taxRegime === 'new' ? 'New' : 'Old'} Tax Regime.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <Card className="p-4">
                            <CardDescription>Taxable Income</CardDescription>
                            <p className="text-2xl font-bold">
                                {formatCurrency(taxableIncomeDisplay)}
                            </p>
                        </Card>
                        <Card className="p-4">
                            <CardDescription>Effective Tax Rate</CardDescription>
                            <p className="text-2xl font-bold">
                                {effectiveTaxRate.toFixed(2)}%
                            </p>
                        </Card>
                         <Card className="md:col-span-2 p-6 bg-primary/10">
                            <CardDescription>Total Tax Payable</CardDescription>
                             <CopyToClipboard value={taxPayable}>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(taxPayable)}</p>
                            </CopyToClipboard>
                        </Card>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

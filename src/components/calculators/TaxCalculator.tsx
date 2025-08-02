
"use client"

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from '@/components/ui/checkbox';


// Tax slab definitions
const taxSlabs = {
    old: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
    ],
    new: [
        { limit: 300000, rate: 0 },
        { limit: 600000, rate: 0.05 },
        { limit: 900000, rate: 0.10 },
        { limit: 1200000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
    ],
};

const CESS_RATE = 0.04;
const STANDARD_DEDUCTION = 50000;
const REBATE_LIMIT_OLD = 500000;
const REBATE_LIMIT_NEW = 700000;

export function TaxCalculator() {
    const [grossIncome, setGrossIncome] = useState(1000000);
    const [regime, setRegime] = useState('new');

    // Deductions
    const [hra, setHra] = useState(0);
    const [section80c, setSection80c] = useState(0);
    const [section80d, setSection80d] = useState(0);
    const [section80tta, setSection80tta] = useState(0);
    const [nps80ccd1b, setNps80ccd1b] = useState(0);
    const [homeLoanInterest, setHomeLoanInterest] = useState(0);
    const [otherDeductions, setOtherDeductions] = useState(0);
    
    const [applyStandardDeduction, setApplyStandardDeduction] = useState(true);

    const [taxPayable, setTaxPayable] = useState(0);
    const [netIncome, setNetIncome] = useState(0);
    const [taxRate, setTaxRate] = useState(0);

    const totalDeductions = useMemo(() => {
        const standardDed = (regime === 'old' || (regime === 'new' && grossIncome > 1550000)) && applyStandardDeduction ? STANDARD_DEDUCTION : 0;
        if (regime === 'new') {
            return standardDed + nps80ccd1b;
        }
        return standardDed + hra + section80c + section80d + section80tta + nps80ccd1b + homeLoanInterest + otherDeductions;
    }, [regime, applyStandardDeduction, hra, section80c, section80d, section80tta, nps80ccd1b, homeLoanInterest, otherDeductions, grossIncome]);

    const taxableIncome = useMemo(() => {
        return Math.max(0, grossIncome - totalDeductions);
    }, [grossIncome, totalDeductions]);


    useEffect(() => {
        const slabs = regime === 'new' ? taxSlabs.new : taxSlabs.old;
        const rebateLimit = regime === 'new' ? REBATE_LIMIT_NEW : REBATE_LIMIT_OLD;
        let income = taxableIncome;
        let tax = 0;
        let lastLimit = 0;

        if (income <= rebateLimit) {
             setTaxPayable(0);
             setNetIncome(grossIncome);
             setTaxRate(0);
             return;
        }

        for (const slab of slabs) {
            if (income > lastLimit) {
                const taxableInSlab = Math.min(income - lastLimit, slab.limit - lastLimit);
                tax += taxableInSlab * slab.rate;
            }
            lastLimit = slab.limit;
        }
        
        const cess = tax * CESS_RATE;
        const totalTax = tax + cess;

        setTaxPayable(totalTax);
        setNetIncome(grossIncome - totalTax);
        setTaxRate(grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0);

    }, [grossIncome, regime, taxableIncome]);
    
    const handleAmountChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value.replace(/[^0-9]/g, ''));
        if (!isNaN(value)) setter(value);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Income Tax Calculator</h1>
                <p className="text-muted-foreground mt-2">Estimate your income tax for the financial year.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                         <CardHeader>
                            <CardTitle>Income & Deductions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="gross-income">Your Gross Annual Income</Label>
                                <Input id="gross-income" type="text" value={formatCurrency(grossIncome)} onChange={handleAmountChange(setGrossIncome)} className="text-lg font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tax Regime</Label>
                                <RadioGroup value={regime} onValueChange={setRegime} className="flex space-x-4 pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="new" id="new-regime" />
                                        <Label htmlFor="new-regime">New Regime (Default)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="old" id="old-regime" />
                                        <Label htmlFor="old-regime">Old Regime</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="item-1">
                                <AccordionTrigger>Common Deductions</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                     <div className="flex items-center space-x-2">
                                        <Checkbox id="std-deduction" checked={applyStandardDeduction} onCheckedChange={(checked) => setApplyStandardDeduction(Boolean(checked))} />
                                        <Label htmlFor="std-deduction" className="font-normal">Apply Standard Deduction of {formatCurrency(STANDARD_DEDUCTION)}</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hra">HRA Exemption (House Rent Allowance)</Label>
                                        <Input id="hra" type="text" value={formatCurrency(hra)} onChange={handleAmountChange(setHra)} disabled={regime === 'new'} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="sec80c">Section 80C (EPF, PPF, Life Insurance, ELSS, etc.)</Label>
                                        <Input id="sec80c" type="text" value={formatCurrency(section80c)} onChange={handleAmountChange(setSection80c)} disabled={regime === 'new'} />
                                    </div>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="item-2">
                                <AccordionTrigger>Other Deductions</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sec80d">80D (Medical Insurance)</Label>
                                            <Input id="sec80d" type="text" value={formatCurrency(section80d)} onChange={handleAmountChange(setSection80d)} disabled={regime === 'new'}/>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="sec80tta">80TTA (Savings Account Interest)</Label>
                                            <Input id="sec80tta" type="text" value={formatCurrency(section80tta)} onChange={handleAmountChange(setSection80tta)} disabled={regime === 'new'}/>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="nps">80CCD(1B) (NPS Contribution)</Label>
                                            <Input id="nps" type="text" value={formatCurrency(nps80ccd1b)} onChange={handleAmountChange(setNps80ccd1b)} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="home-loan">Home Loan Interest</Label>
                                            <Input id="home-loan" type="text" value={formatCurrency(homeLoanInterest)} onChange={handleAmountChange(setHomeLoanInterest)} disabled={regime === 'new'} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="other">Other Deductions</Label>
                                            <Input id="other" type="text" value={formatCurrency(otherDeductions)} onChange={handleAmountChange(setOtherDeductions)} disabled={regime === 'new'} />
                                        </div>
                                    </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <CardHeader className="text-center">
                            <CardDescription>Taxable Income</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(taxableIncome)}</p>
                        </CardHeader>
                    </Card>
                     <Card className="bg-primary/10">
                        <CardHeader className="text-center">
                            <CardDescription>Total Tax Payable</CardDescription>
                            <p className="text-3xl font-bold text-primary">{formatCurrency(taxPayable)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <CardDescription>Effective Tax Rate</CardDescription>
                            <p className="text-2xl font-bold">{formatPercentage(taxRate)}</p>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <CardDescription>Net In-Hand Income</CardDescription>
                            <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
                        </CardHeader>
                    </Card>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>About Income Tax Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                       This calculator helps you estimate your income tax liability for a financial year based on your income and deductions. You can compare your tax outgo under both the old and new tax regimes to make an informed choice.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li><span className="font-semibold text-foreground">Old Regime:</span> Allows you to claim various deductions and exemptions (like 80C, HRA, etc.) to reduce your taxable income.</li>
                        <li><span className="font-semibold text-foreground">New Regime:</span> Offers lower tax rates but does not allow most of the common deductions. It is the default regime unless you opt out.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

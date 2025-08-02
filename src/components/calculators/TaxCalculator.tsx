
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const oldRegimeSlabs = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

const newRegimeSlabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

export function TaxCalculator() {
    // Inputs
    const [grossIncome, setGrossIncome] = useState(1000000);
    const [basicSalary, setBasicSalary] = useState(500000);
    const [hra, setHra] = useState(250000);
    const [otherAllowances, setOtherAllowances] = useState(250000);

    const [rentPaid, setRentPaid] = useState(180000);
    const [isMetro, setIsMetro] = useState(true);
    
    const [sec80c, setSec80c] = useState(150000);
    const [sec80d, setSec80d] = useState(25000);
    const [sec80tta, setSec80tta] = useState(10000);
    const [homeLoanInterest, setHomeLoanInterest] = useState(0);
    const [nps, setNps] = useState(0);
    const [standardDeduction, setStandardDeduction] = useState(50000);
    
    // Tax Regime
    const [taxRegime, setTaxRegime] = useState('new');
    
    // Outputs
    const [taxableIncome, setTaxableIncome] = useState(0);
    const [taxPayable, setTaxPayable] = useState(0);
    const [surcharge, setSurcharge] = useState(0);
    const [cess, setCess] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);


    const calculateTax = (income: number, slabs: typeof oldRegimeSlabs) => {
        let tax = 0;
        let remainingIncome = income;
        let lastLimit = 0;

        for (const slab of slabs) {
            if (remainingIncome > 0) {
                const taxableInSlab = Math.min(remainingIncome, slab.limit - lastLimit);
                tax += taxableInSlab * slab.rate;
                remainingIncome -= taxableInSlab;
                lastLimit = slab.limit;
            }
        }
        return tax;
    };

    useEffect(() => {
        const calculatedGross = basicSalary + hra + otherAllowances;
        setGrossIncome(calculatedGross);
    }, [basicSalary, hra, otherAllowances]);

    useEffect(() => {
        let currentTaxableIncome = grossIncome;
        
        if (taxRegime === 'old') {
            const hraExemptionLimit = isMetro ? 0.5 * basicSalary : 0.4 * basicSalary;
            const hraExemption = Math.min(hra, rentPaid - 0.1 * basicSalary, hraExemptionLimit);
            const hraDeduction = Math.max(0, hraExemption);
            
            currentTaxableIncome -= hraDeduction;
            currentTaxableIncome -= Math.min(sec80c, 150000);
            currentTaxableIncome -= Math.min(sec80d, 100000);
            currentTaxableIncome -= Math.min(sec80tta, 10000);
            currentTaxableIncome -= Math.min(homeLoanInterest, 200000);
            currentTaxableIncome -= Math.min(nps, 50000);
            currentTaxableIncome -= Math.min(standardDeduction, 50000);

        } else { // New Regime
             currentTaxableIncome -= Math.min(standardDeduction, 50000);
        }

        const finalTaxableIncome = Math.max(0, currentTaxableIncome);
        setTaxableIncome(finalTaxableIncome);

        let tax = 0;
        if (taxRegime === 'new' && finalTaxableIncome <= 700000) {
            tax = 0; // Rebate under Section 87A
        } else if (taxRegime === 'old' && finalTaxableIncome <= 500000) {
             tax = 0; // Rebate under Section 87A
        } else {
             tax = calculateTax(finalTaxableIncome, taxRegime === 'old' ? oldRegimeSlabs : newRegimeSlabs);
        }

        setTaxPayable(tax);
        
        let currentSurcharge = 0;
        if (finalTaxableIncome > 5000000 && finalTaxableIncome <= 10000000) {
            currentSurcharge = tax * 0.10;
        } else if (finalTaxableIncome > 10000000 && finalTaxableIncome <= 20000000) {
            currentSurcharge = tax * 0.15;
        } else if (finalTaxableIncome > 20000000 && finalTaxableIncome <= 50000000) {
            currentSurcharge = tax * 0.25;
        } else if (finalTaxableIncome > 50000000) {
            currentSurcharge = tax * (taxRegime === 'new' ? 0.25 : 0.37);
        }
        setSurcharge(currentSurcharge);

        const currentCess = (tax + currentSurcharge) * 0.04;
        setCess(currentCess);

        const total = tax + currentSurcharge + currentCess;
        setTotalTax(total);

        setEffectiveTaxRate(grossIncome > 0 ? (total / grossIncome) * 100 : 0);

    }, [grossIncome, basicSalary, hra, rentPaid, isMetro, sec80c, sec80d, sec80tta, homeLoanInterest, nps, standardDeduction, taxRegime, otherAllowances]);


    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Income Tax Calculator</h1>
                <p className="text-muted-foreground mt-2">Estimate your income tax for the financial year.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6 sticky top-24">
                    <Card>
                         <CardHeader>
                            <CardTitle>Tax Regime</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={taxRegime} onValueChange={setTaxRegime} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="new" id="new" />
                                    <Label htmlFor="new">New Regime</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="old" id="old" />
                                    <Label htmlFor="old">Old Regime</Label>
                                </div>
                            </RadioGroup>
                            <p className="text-xs text-muted-foreground mt-3">The New Tax Regime is the default regime. Choose the Old Regime if you want to claim deductions.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="text-center">
                            <CardDescription>Total Tax Payable</CardDescription>
                            <p className="text-4xl font-bold text-primary">{formatCurrency(totalTax)}</p>
                        </CardHeader>
                        <CardContent className="text-center text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>Taxable Income:</span>
                                <span>{formatCurrency(taxableIncome)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Income Tax:</span>
                                <span>{formatCurrency(taxPayable)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Surcharge:</span>
                                <span>{formatCurrency(surcharge)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Cess:</span>
                                <span>{formatCurrency(cess)}</span>
                            </div>
                             <div className="flex justify-between font-bold border-t pt-2 mt-2">
                                <span>Effective Tax Rate:</span>
                                <span>{formatPercentage(effectiveTaxRate)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Income Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Gross Annual Income</Label>
                                <Input type="text" value={formatCurrency(grossIncome)} readOnly className="font-semibold text-lg bg-muted" />
                            </div>
                            <Accordion type="single" collapsible defaultValue="item-1">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Salary Components</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="basic-salary">Basic Salary</Label>
                                            <Input id="basic-salary" type="text" value={formatCurrency(basicSalary)} onChange={(e) => setBasicSalary(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="hra">House Rent Allowance (HRA)</Label>
                                            <Input id="hra" type="text" value={formatCurrency(hra)} onChange={(e) => setHra(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="other-allowances">Other Allowances</Label>
                                            <Input id="other-allowances" type="text" value={formatCurrency(otherAllowances)} onChange={(e) => setOtherAllowances(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <Card className={taxRegime === 'new' ? 'opacity-50 pointer-events-none' : ''}>
                        <CardHeader>
                            <CardTitle>Deductions (Old Regime Only)</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <Accordion type="multiple" className="w-full space-y-2">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>HRA Exemption</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="rent-paid">Annual Rent Paid</Label>
                                            <Input id="rent-paid" type="text" value={formatCurrency(rentPaid)} onChange={(e) => setRentPaid(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="metro-city" checked={isMetro} onCheckedChange={setIsMetro} />
                                            <Label htmlFor="metro-city">Do you live in a metro city (Delhi, Mumbai, Kolkata, Chennai)?</Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="item-2">
                                    <AccordionTrigger>Standard Deductions</AccordionTrigger>
                                     <AccordionContent className="space-y-4 pt-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="standard-deduction">Standard Deduction</Label>
                                            <Input id="standard-deduction" type="text" value={formatCurrency(standardDeduction)} onChange={(e) => setStandardDeduction(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Investments & Expenses</AccordionTrigger>
                                     <AccordionContent className="space-y-4 pt-4">
                                         <div className="space-y-2">
                                            <Label htmlFor="sec80c">Section 80C (e.g., PF, PPF, ELSS, Life Insurance)</Label>
                                            <Input id="sec80c" type="text" value={formatCurrency(sec80c)} onChange={(e) => setSec80c(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                            <p className="text-xs text-muted-foreground">Max limit: ₹1,50,000</p>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="sec80d">Section 80D (Health Insurance Premium)</Label>
                                            <Input id="sec80d" type="text" value={formatCurrency(sec80d)} onChange={(e) => setSec80d(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                             <p className="text-xs text-muted-foreground">Max limit varies based on age.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="home-loan">Interest on Home Loan (Self-Occupied)</Label>
                                            <Input id="home-loan" type="text" value={formatCurrency(homeLoanInterest)} onChange={(e) => setHomeLoanInterest(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                            <p className="text-xs text-muted-foreground">Max limit: ₹2,00,000</p>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="nps">NPS Contribution (80CCD(1B))</Label>
                                            <Input id="nps" type="text" value={formatCurrency(nps)} onChange={(e) => setNps(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                            <p className="text-xs text-muted-foreground">Max limit: ₹50,000</p>
                                        </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="sec80tta">Section 80TTA (Interest on Savings Account)</Label>
                                            <Input id="sec80tta" type="text" value={formatCurrency(sec80tta)} onChange={(e) => setSec80tta(Number(e.target.value.replace(/[^0-9]/g, '')))} />
                                             <p className="text-xs text-muted-foreground">Max limit: ₹10,000</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                         </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

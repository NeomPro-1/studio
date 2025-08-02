"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Simplified tax slabs for demonstration. A real app would need updated slabs for each AY.
const oldRegimeSlabs = {
    below60: [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
    ],
    above60: [
        { limit: 300000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
    ],
};

const newRegimeSlabs = [
    { limit: 300000, rate: 0 },
    { limit: 600000, rate: 0.05 },
    { limit: 900000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

const InputField = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void; }) => (
    <div className="grid grid-cols-2 items-center gap-4">
        <Label htmlFor={label.toLowerCase().replace(/ /g, '-')}>{label}</Label>
        <Input
            id={label.toLowerCase().replace(/ /g, '-')}
            type="text"
            value={formatCurrency(value)}
            onChange={(e) => {
                const numValue = Number(e.target.value.replace(/[^0-9]/g, ''));
                if (!isNaN(numValue)) onChange(numValue);
            }}
            className="text-right"
        />
    </div>
);


export function TaxCalculator() {
    const [assessmentYear, setAssessmentYear] = useState('2025-26');
    const [ageCategory, setAgeCategory] = useState('below60');

    // Income
    const [grossSalary, setGrossSalary] = useState(0);
    const [otherIncome, setOtherIncome] = useState(0);
    const [interestIncome, setInterestIncome] = useState(0);
    const [rentalIncome, setRentalIncome] = useState(0);
    const [homeLoanInterestSelf, setHomeLoanInterestSelf] = useState(0);
    const [homeLoanInterestLetOut, setHomeLoanInterestLetOut] = useState(0);

    // Deductions
    const [deduction80C, setDeduction80C] = useState(0);
    const [deduction80CCD, setDeduction80CCD] = useState(0);
    const [deduction80D, setDeduction80D] = useState(0);
    const [deduction80G, setDeduction80G] = useState(0);
    const [deduction80E, setDeduction80E] = useState(0);
    const [deduction80TTA, setDeduction80TTA] = useState(0);

    // HRA
    const [basicSalaryHra, setBasicSalaryHra] = useState(0);
    const [daHra, setDaHra] = useState(0);
    const [hraReceived, setHraReceived] = useState(0);
    const [rentPaid, setRentPaid] = useState(0);
    
    // Results
    const [taxCalculationResult, setTaxCalculationResult] = useState<{oldTax: number, newTax: number} | null>(null);


    const calculateTax = () => {
        // HRA Calculation
        const salaryForHra = basicSalaryHra + daHra;
        const hraExemption1 = hraReceived;
        const hraExemption2 = rentPaid - (0.10 * salaryForHra);
        const hraExemption3 = 0.50 * salaryForHra; // Assuming metro city
        const hraExemption = Math.max(0, Math.min(hraExemption1, hraExemption2, hraExemption3));

        // Income Calculation
        const totalSalary = grossSalary - Math.min(50000, grossSalary); // Standard Deduction
        const netRentalIncome = rentalIncome * 0.70; // 30% standard deduction on rental
        const lossOnHouseProperty = Math.min(200000, homeLoanInterestSelf);
        const netIncomeFromHouse = netRentalIncome - homeLoanInterestLetOut;

        const grossTotalIncome = totalSalary + otherIncome + interestIncome + netIncomeFromHouse - lossOnHouseProperty;

        // Old Regime Calculation
        const totalDeductions = 
            Math.min(150000, deduction80C) + 
            Math.min(50000, deduction80CCD) + 
            deduction80D + 
            deduction80G + 
            deduction80E + 
            Math.min(10000, deduction80TTA) +
            hraExemption;

        const taxableIncomeOld = Math.max(0, grossTotalIncome - totalDeductions);
        
        let oldTax = 0;
        let remainingIncomeOld = taxableIncomeOld;
        const slabsOld = oldRegimeSlabs[ageCategory as keyof typeof oldRegimeSlabs];
        let lastLimit = 0;
        for (const slab of slabsOld) {
            if (remainingIncomeOld <= 0) break;
            const taxableInSlab = Math.min(remainingIncomeOld, slab.limit - lastLimit);
            oldTax += taxableInSlab * slab.rate;
            remainingIncomeOld -= taxableInSlab;
            lastLimit = slab.limit;
        }
        if(taxableIncomeOld > 0) oldTax += oldTax * 0.04; // Cess

        // New Regime Calculation (simplified, no deductions except standard)
        const taxableIncomeNew = Math.max(0, grossTotalIncome);
        let newTax = 0;
        let remainingIncomeNew = taxableIncomeNew;
        let lastLimitNew = 0;
        for (const slab of newRegimeSlabs) {
            if (remainingIncomeNew <= 0) break;
            const taxableInSlab = Math.min(remainingIncomeNew, slab.limit - lastLimitNew);
            newTax += taxableInSlab * slab.rate;
            remainingIncomeNew -= taxableInSlab;
            lastLimitNew = slab.limit;
        }
         if(taxableIncomeNew > 0) newTax += newTax * 0.04; // Cess
        
        setTaxCalculationResult({ oldTax: Math.round(oldTax), newTax: Math.round(newTax) });
    };
    
    const currentYear = new Date().getFullYear();
    const assessmentYears = Array.from({ length: currentYear + 2 - 2000 }, (_, i) => `${2000 + i}-${2001 + i}`).reverse();

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Income Tax Calculator</h1>
                <p className="text-muted-foreground mt-2">Estimate your tax liability under the old and new regimes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Assessment Year</Label>
                                <Select value={assessmentYear} onValueChange={setAssessmentYear}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {assessmentYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Age Category</Label>
                                <RadioGroup value={ageCategory} onValueChange={setAgeCategory} className="flex pt-2">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="below60" id="below60" />
                                        <Label htmlFor="below60">Below 60</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="above60" id="above60" />
                                        <Label htmlFor="above60">60 and Above</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>

                     <Accordion type="multiple" defaultValue={['income', 'deductions']} className="w-full">
                        <AccordionItem value="income">
                            <AccordionTrigger className="text-lg font-semibold">Income</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <InputField label="Gross salary income" value={grossSalary} onChange={setGrossSalary} />
                                <InputField label="Annual income from other sources" value={otherIncome} onChange={setOtherIncome} />
                                <InputField label="Annual income from interest" value={interestIncome} onChange={setInterestIncome} />
                                <InputField label="Annual income from let-out house property (rental income)" value={rentalIncome} onChange={setRentalIncome} />
                                <InputField label="Annual interest paid on home loan (self-occupied)" value={homeLoanInterestSelf} onChange={setHomeLoanInterestSelf} />
                                <InputField label="Annual interest paid on home loan (let-out)" value={homeLoanInterestLetOut} onChange={setHomeLoanInterestLetOut} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="deductions">
                             <AccordionTrigger className="text-lg font-semibold">Deductions</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <InputField label="Basic Deductions u/s 80C" value={deduction80C} onChange={setDeduction80C} />
                                <InputField label="Contribution to NPS u/s 80CCD(1B)" value={deduction80CCD} onChange={setDeduction80CCD} />
                                <InputField label="Medical Insurance Premium u/s 80D" value={deduction80D} onChange={setDeduction80D} />
                                <InputField label="Donation to charity u/s 80G" value={deduction80G} onChange={setDeduction80G} />
                                <InputField label="Interest on Educational Loan u/s 80E" value={deduction80E} onChange={setDeduction80E} />
                                <InputField label="Interest on Deposits in saving account u/s 80TTA/TTB" value={deduction80TTA} onChange={setDeduction80TTA} />
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="hra">
                             <AccordionTrigger className="text-lg font-semibold">HRA Exemption</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                                <InputField label="Basic Salary received per annum" value={basicSalaryHra} onChange={setBasicSalaryHra} />
                                <InputField label="Dearness Allowance (DA) received per annum" value={daHra} onChange={setDaHra} />
                                <InputField label="HRA received per annum" value={hraReceived} onChange={setHraReceived} />
                                <InputField label="Total rent paid per annum" value={rentPaid} onChange={setRentPaid} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                     <Button onClick={calculateTax} className="w-full text-lg py-6">Calculate Tax</Button>
                </div>
                <div className="lg:col-span-1 space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Tax Summary</CardTitle>
                            <CardDescription>Based on your entries.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {taxCalculationResult ? (
                                <>
                                    <div className="p-4 rounded-lg bg-muted">
                                        <Label className="text-muted-foreground">Tax as per Old Regime</Label>
                                        <p className="text-2xl font-bold">{formatCurrency(taxCalculationResult.oldTax)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-muted">
                                        <Label className="text-muted-foreground">Tax as per New Regime</Label>
                                        <p className="text-2xl font-bold">{formatCurrency(taxCalculationResult.newTax)}</p>
                                    </div>
                                     <div className={`p-4 rounded-lg ${taxCalculationResult.newTax < taxCalculationResult.oldTax ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                                        <Label className="text-sm">{taxCalculationResult.newTax < taxCalculationResult.oldTax ? 'New Regime is more beneficial' : 'Old Regime is more beneficial'}</Label>
                                        <p className="text-lg font-bold">You can save {formatCurrency(Math.abs(taxCalculationResult.newTax - taxCalculationResult.oldTax))}</p>
                                    </div>
                                </>
                           ) : (
                                <div className="text-center p-8 text-muted-foreground">
                                    <p>Enter your details and click "Calculate" to see your tax summary.</p>
                                </div>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

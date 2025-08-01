
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const oldSlabs_below60 = [
    { limit: 250000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

const oldSlabs_60_to_80 = [
    { limit: 300000, rate: 0 },
    { limit: 500000, rate: 0.05 },
    { limit: 1000000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];

const oldSlabs_above80 = [
    { limit: 500000, rate: 0 },
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

const calculateTaxInternal = (income: number, slabs: typeof oldSlabs_below60) => {
    let tax = 0;
    let taxableIncome = income;

    if (taxableIncome <= slabs[0].limit) {
      return 0;
    }

    slabs.reduce((prevLimit, slab) => {
      if (taxableIncome > prevLimit) {
        const taxableInSlab = Math.min(taxableIncome - prevLimit, slab.limit - prevLimit);
        tax += taxableInSlab * slab.rate;
      }
      return slab.limit;
    }, 0);

    return tax;
};


export function TaxCalculator() {
  const [assessmentYear, setAssessmentYear] = useState('2025-2026');
  const [ageCategory, setAgeCategory] = useState('below_60');
  const [taxRegime, setTaxRegime] = useState('new');

  // Income
  const [grossSalary, setGrossSalary] = useState(0);
  const [otherSources, setOtherSources] = useState(0);
  const [interestIncome, setInterestIncome] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [interestSelfOccupied, setInterestSelfOccupied] = useState(0);
  const [interestLetOut, setInterestLetOut] = useState(0);
  
  // Deductions
  const [basicDeductions80C, setBasicDeductions80C] = useState(0);
  const [npsContribution, setNpsContribution] = useState(0);
  const [medicalPremium, setMedicalPremium] = useState(0);
  const [donation, setDonation] = useState(0);
  const [educationLoanInterest, setEducationLoanInterest] = useState(0);
  const [savingsInterest, setSavingsInterest] = useState(0);

  // HRA
  const [hraBasicSalary, setHraBasicSalary] = useState(0);
  const [hraDa, setHraDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(0);
  const [rentPaid, setRentPaid] = useState(0);

  // Results
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxPayable, setTaxPayable] = useState(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    const totalGrossIncome = grossSalary + otherSources + interestIncome + rentalIncome;
    let finalTaxableIncome = 0;
    let finalTax = 0;
    const isOldRegime = taxRegime === 'old';

    if (isOldRegime) {
      const hraExemptionComponent1 = hraReceived;
      const hraExemptionComponent2 = (hraBasicSalary + hraDa) * 0.5; // Assuming metro city
      const hraExemptionComponent3 = rentPaid > 0 ? rentPaid - (hraBasicSalary + hraDa) * 0.1 : 0;
      const finalHraExemption = Math.max(0, Math.min(hraExemptionComponent1, hraExemptionComponent2, hraExemptionComponent3));
      
      const totalDeductions =
          Math.min(150000, basicDeductions80C) +
          Math.min(50000, npsContribution) +
          Math.min(25000, medicalPremium) + // Assuming below 60 for simplicity
          donation +
          educationLoanInterest +
          Math.min(10000, savingsInterest) +
          Math.min(200000, interestSelfOccupied) +
          interestLetOut +
          (grossSalary > 0 ? 50000 : 0); // Standard Deduction for old regime (salaried)

      const grossTaxableIncome = totalGrossIncome - finalHraExemption;
      finalTaxableIncome = Math.max(0, grossTaxableIncome - totalDeductions);
      
      let slabs;
      if (ageCategory === 'below_60') slabs = oldSlabs_below60;
      else if (ageCategory === '60_to_80') slabs = oldSlabs_60_to_80;
      else slabs = oldSlabs_above80;

      let tax = calculateTaxInternal(finalTaxableIncome, slabs);
      
      if (finalTaxableIncome <= 500000) {
        tax = 0; // Rebate u/s 87A
      }

      const cess = tax * 0.04;
      finalTax = tax > 0 ? tax + cess : 0;

    } else { // New Regime
      const standardDeduction = (grossSalary > 0 ? 50000 : 0);
      finalTaxableIncome = Math.max(0, totalGrossIncome - standardDeduction);
      let tax = calculateTaxInternal(finalTaxableIncome, newSlabs);
      
      if (finalTaxableIncome <= 700000) {
          tax = 0; // Rebate u/s 87A
      }
      
      const cess = tax * 0.04;
      finalTax = tax > 0 ? tax + cess : 0;
    }
    
    setTaxableIncome(finalTaxableIncome);
    setTaxPayable(finalTax);
    setEffectiveTaxRate(totalGrossIncome > 0 ? (finalTax / totalGrossIncome) * 100 : 0);
    setShowResults(true);
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const numberValue = Number(value.replace(/[^0-9]/g, ''));
      if (value === '') {
        setter(0);
      } else if (!isNaN(numberValue)) {
        setter(numberValue);
      }
  };

  const isOldRegime = taxRegime === 'old';

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
                        <CardTitle>Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <Label>Assessment Year</Label>
                           <Select value={assessmentYear} onValueChange={setAssessmentYear}>
                               <SelectTrigger><SelectValue /></SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="2025-2026">2025-2026</SelectItem>
                                   <SelectItem value="2024-2025">2024-2025</SelectItem>
                               </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                           <Label>Age Category</Label>
                           <Select value={ageCategory} onValueChange={setAgeCategory} disabled={!isOldRegime}>
                               <SelectTrigger><SelectValue /></SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="below_60">Below 60</SelectItem>
                                   <SelectItem value="60_to_80">60 to 80 (Senior Citizen)</SelectItem>
                                   <SelectItem value="above_80">Above 80 (Super Senior)</SelectItem>
                               </SelectContent>
                           </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tax Regime</Label>
                            <RadioGroup value={taxRegime} onValueChange={setTaxRegime} className="flex space-x-4 pt-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="new" id="new-regime" />
                                    <Label htmlFor="new-regime">New</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="old" id="old-regime" />
                                    <Label htmlFor="old-regime">Old</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>

                <Accordion type="multiple" defaultValue={["income-details"]} className="w-full">
                    <AccordionItem value="income-details">
                        <AccordionTrigger className="text-lg font-semibold">Income Details</AccordionTrigger>
                        <AccordionContent>
                             <Card>
                                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label>Gross salary income</Label><Input type="text" value={grossSalary} onChange={handleInputChange(setGrossSalary)} /></div>
                                    <div className="space-y-1"><Label>Income from other sources</Label><Input type="text" value={otherSources} onChange={handleInputChange(setOtherSources)} /></div>
                                    <div className="space-y-1"><Label>Income from interest</Label><Input type="text" value={interestIncome} onChange={handleInputChange(setInterestIncome)} /></div>
                                    <div className="space-y-1"><Label>Rental income (let-out)</Label><Input type="text" value={rentalIncome} onChange={handleInputChange(setRentalIncome)} /></div>
                                    <div className="space-y-1"><Label>Annual interest paid on home loan (self-occupied)</Label><Input type="text" value={interestSelfOccupied} onChange={handleInputChange(setInterestSelfOccupied)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Annual interest paid on home loan (let-out)</Label><Input type="text" value={interestLetOut} onChange={handleInputChange(setInterestLetOut)} disabled={!isOldRegime} /></div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="deductions">
                        <AccordionTrigger className="text-lg font-semibold">Deductions</AccordionTrigger>
                        <AccordionContent>
                             <Card>
                                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label>Basic Deductions u/s 80C</Label><Input type="text" value={basicDeductions80C} onChange={handleInputChange(setBasicDeductions80C)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Contribution to NPS u/s 80CCD(1B)</Label><Input type="text" value={npsContribution} onChange={handleInputChange(setNpsContribution)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Medical Insurance Premium u/s 80D</Label><Input type="text" value={medicalPremium} onChange={handleInputChange(setMedicalPremium)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Donation to charity u/s 80G</Label><Input type="text" value={donation} onChange={handleInputChange(setDonation)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Interest on Educational Loan u/s 80E</Label><Input type="text" value={educationLoanInterest} onChange={handleInputChange(setEducationLoanInterest)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Interest on Deposits u/s 80TTA/TTB</Label><Input type="text" value={savingsInterest} onChange={handleInputChange(setSavingsInterest)} disabled={!isOldRegime} /></div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="hra-exemption">
                        <AccordionTrigger className="text-lg font-semibold">HRA Exemption</AccordionTrigger>
                        <AccordionContent>
                            <Card>
                                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label>Basic Salary per annum</Label><Input type="text" value={hraBasicSalary} onChange={handleInputChange(setHraBasicSalary)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Dearness Allowance (DA) per annum</Label><Input type="text" value={hraDa} onChange={handleInputChange(setHraDa)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>HRA received per annum</Label><Input type="text" value={hraReceived} onChange={handleInputChange(setHraReceived)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Total rent paid per annum</Label><Input type="text" value={rentPaid} onChange={handleInputChange(setRentPaid)} disabled={!isOldRegime} /></div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button onClick={handleCalculate} className="w-full text-lg">Calculate Tax</Button>
            </div>

            <Card className="lg:col-span-1 h-fit sticky top-24">
                <CardHeader>
                    <CardTitle>Tax Summary</CardTitle>
                    <CardDescription>Based on the {taxRegime === 'new' ? 'New' : 'Old'} Tax Regime.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    {showResults ? (
                        <>
                            <Card className="p-4">
                                <CardDescription>Taxable Income</CardDescription>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(taxableIncome)}
                                </p>
                            </Card>
                            <Card className="p-4">
                                <CardDescription>Effective Tax Rate</CardDescription>
                                <p className="text-2xl font-bold">
                                    {formatPercentage(effectiveTaxRate)}
                                </p>
                            </Card>
                             <Card className="p-6 bg-primary/10">
                                <CardDescription>Total Tax Payable</CardDescription>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(taxPayable)}</p>
                            </Card>
                        </>
                    ) : (
                        <p className="text-muted-foreground py-12">Click "Calculate Tax" to see your results.</p>
                    )}
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>About Income Tax Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    This Income Tax Calculator helps you estimate your tax liability for a financial year based on your income and eligible deductions. It supports both the Old and New Tax Regimes, allowing you to compare and choose the more beneficial option. Proper tax planning is crucial for maximizing your savings and ensuring compliance with tax laws. This tool simplifies the complex calculations involved in determining your taxable income and final tax payable.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                       Taxable Income = Gross Income - Deductions
                    </p>
                     <p className="font-mono text-center text-sm sm:text-base mt-2">
                        Tax Payable = (Tax on Income as per Slabs) + Surcharge + Cess
                    </p>
                </div>
                 <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">Old Regime:</span> Allows various deductions (80C, 80D, HRA etc.) but has higher tax rates.</li>
                    <li><span className="font-semibold text-foreground">New Regime:</span> Offers lower tax rates but fewer deductions. A standard deduction of ₹50,000 is available.</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

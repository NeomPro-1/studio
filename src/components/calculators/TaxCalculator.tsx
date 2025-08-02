
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';

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
  const [isCtcMode, setIsCtcMode] = useState(false);

  // CTC Mode
  const [ctc, setCtc] = useState(1000000);

  // Income
  const [grossSalary, setGrossSalary] = useState(0);
  const [otherSources, setOtherSources] = useState(0);
  const [interestIncome, setInterestIncome] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [interestSelfOccupied, setInterestSelfOccupied] = useState(0);
  const [interestLetOut, setInterestLetOut] = useState(0);
  
  // Deductions
  const [epfContribution, setEpfContribution] = useState(0);
  const [hraExemption, setHraExemption] = useState(0);
  const [basicDeductions80C, setBasicDeductions80C] = useState(0);
  const [npsContribution, setNpsContribution] = useState(0);
  const [medicalPremium, setMedicalPremium] = useState(0);
  const [donation, setDonation] = useState(0);
  const [educationLoanInterest, setEducationLoanInterest] = useState(0);
  const [savingsInterest, setSavingsInterest] = useState(0);

  // HRA
  const [rentPaid, setRentPaid] = useState(0);
  const [isMetroCity, setIsMetroCity] = useState(true);

  // Results
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxPayable, setTaxPayable] = useState(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);
  const [inHandSalary, setInHandSalary] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [resultBreakdown, setResultBreakdown] = useState<any>({});


  useEffect(() => {
    if (isCtcMode) {
      const basicSalary = ctc * 0.4; // 40% of CTC
      const hra = basicSalary * (isMetroCity ? 0.5 : 0.4);
      const employerEpf = Math.min(basicSalary * 0.12, 1800); // 12% of basic, capped at 1800/month
      
      const employeeEpf = employerEpf;
      const specialAllowance = ctc - basicSalary - hra - (employerEpf * 12);
      
      const calculatedGrossSalary = basicSalary + hra + specialAllowance;
      
      setGrossSalary(calculatedGrossSalary);
      setEpfContribution(employeeEpf * 12);
    }
  }, [ctc, isCtcMode, isMetroCity]);


  const handleCalculate = () => {
    // Determine Basic salary for HRA calc
    const basicForHra = isCtcMode ? ctc * 0.4 : grossSalary * 0.5; // assumption
    
    // HRA Exemption Calculation
    const hraReceivedComponent = isCtcMode ? basicForHra * (isMetroCity ? 0.5 : 0.4) : 0;
    const rentCondition = rentPaid - (basicForHra * 0.1);
    const cityCondition = basicForHra * (isMetroCity ? 0.5 : 0.4);
    const hraExemptionCalc = Math.max(0, Math.min(hraReceivedComponent, rentCondition, cityCondition));
    setHraExemption(hraExemptionCalc);

    const totalGrossIncome = grossSalary + otherSources + interestIncome + rentalIncome;
    let finalTaxableIncome = 0;
    let finalTax = 0;
    let finalInHandSalary = 0;
    const isOldRegime = taxRegime === 'old';

    // Deductions common to both modes
    const totalEpf = epfContribution;
    const professionalTax = 2500; // Fixed for most states

    if (isOldRegime) {
      const totalDeductions =
          Math.min(150000, basicDeductions80C + totalEpf) +
          Math.min(50000, npsContribution) +
          Math.min(25000, medicalPremium) + // Assuming below 60 for simplicity
          donation +
          educationLoanInterest +
          Math.min(10000, savingsInterest) +
          Math.min(200000, interestSelfOccupied) +
          interestLetOut +
          (grossSalary > 0 ? 50000 : 0) + // Standard Deduction
          hraExemptionCalc;

      const grossTaxableIncome = totalGrossIncome;
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
      finalInHandSalary = totalGrossIncome - finalTax - totalEpf - professionalTax;

    } else { // New Regime
      const standardDeduction = (grossSalary > 0 ? 50000 : 0);
      finalTaxableIncome = Math.max(0, totalGrossIncome - standardDeduction);
      let tax = calculateTaxInternal(finalTaxableIncome, newSlabs);
      
      if (finalTaxableIncome <= 700000) {
          tax = 0; // Rebate u/s 87A
      }
      
      const cess = tax * 0.04;
      finalTax = tax > 0 ? tax + cess : 0;
      finalInHandSalary = totalGrossIncome - finalTax - totalEpf - professionalTax;
    }
    
    setTaxableIncome(finalTaxableIncome);
    setTaxPayable(finalTax);
    setInHandSalary(finalInHandSalary);
    setEffectiveTaxRate(totalGrossIncome > 0 ? (finalTax / totalGrossIncome) * 100 : 0);
    
    if(isCtcMode) {
        const basic = ctc * 0.4;
        const hra = basic * (isMetroCity ? 0.5 : 0.4);
        const employerEpf = Math.min(basic * 0.12, 1800) * 12;
        const specialAllowance = ctc - basic - hra - employerEpf;

        setResultBreakdown({
            basic, hra, specialAllowance, employerEpf,
            employeeEpf: epfContribution,
            gross: basic+hra+specialAllowance,
            inHand: finalInHandSalary,
            tax: finalTax
        })
    }

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
  
  const displayFormattedCurrency = (value: number) => {
    if (value === 0) return '';
    return value.toLocaleString('en-IN');
  }

  const isOldRegime = taxRegime === 'old';

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Salary & Income Tax Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate your take-home salary and income tax liability.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Calculation Mode</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-2">
                        <Label htmlFor="ctc-mode">Manual Income Entry</Label>
                        <Switch id="ctc-mode" checked={isCtcMode} onCheckedChange={setIsCtcMode} />
                        <Label htmlFor="ctc-mode">CTC Breakup</Label>
                    </CardContent>
                </Card>
                {isCtcMode && (
                  <Card>
                    <CardHeader><CardTitle>Enter Your CTC</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label>Annual CTC (Cost to Company)</Label>
                            <Input type="text" value={displayFormattedCurrency(ctc)} onChange={handleInputChange(setCtc)} />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="metro-city" checked={isMetroCity} onCheckedChange={setIsMetroCity} />
                            <Label htmlFor="metro-city">Do you live in a metro city? (for HRA calculation)</Label>
                        </div>
                        <p className="text-xs text-muted-foreground">This mode automatically estimates your salary components based on standard industry practices (e.g., Basic at 40% of CTC). You can adjust these in the 'Income Details' section below.</p>
                    </CardContent>
                  </Card>
                )}
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
                                    <div className="space-y-1"><Label>Gross salary income</Label><Input type="text" value={displayFormattedCurrency(grossSalary)} onChange={handleInputChange(setGrossSalary)} disabled={isCtcMode}/></div>
                                    <div className="space-y-1"><Label>Income from other sources</Label><Input type="text" value={displayFormattedCurrency(otherSources)} onChange={handleInputChange(setOtherSources)} /></div>
                                    <div className="space-y-1"><Label>Income from interest</Label><Input type="text" value={displayFormattedCurrency(interestIncome)} onChange={handleInputChange(setInterestIncome)} /></div>
                                    <div className="space-y-1"><Label>Rental income (let-out)</Label><Input type="text" value={displayFormattedCurrency(rentalIncome)} onChange={handleInputChange(setRentalIncome)} /></div>
                                    <div className="space-y-1"><Label>Annual interest paid on home loan (self-occupied)</Label><Input type="text" value={displayFormattedCurrency(interestSelfOccupied)} onChange={handleInputChange(setInterestSelfOccupied)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Annual interest paid on home loan (let-out)</Label><Input type="text" value={displayFormattedCurrency(interestLetOut)} onChange={handleInputChange(setInterestLetOut)} disabled={!isOldRegime} /></div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="deductions">
                        <AccordionTrigger className="text-lg font-semibold">Deductions</AccordionTrigger>
                        <AccordionContent>
                             <Card>
                                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><Label>Your EPF Contribution (12% of Basic)</Label><Input type="text" value={displayFormattedCurrency(epfContribution)} onChange={handleInputChange(setEpfContribution)} disabled={isCtcMode} /></div>
                                    <div className="space-y-1"><Label>Total rent paid per annum (for HRA)</Label><Input type="text" value={displayFormattedCurrency(rentPaid)} onChange={handleInputChange(setRentPaid)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Other Deductions u/s 80C</Label><Input type="text" value={displayFormattedCurrency(basicDeductions80C)} onChange={handleInputChange(setBasicDeductions80C)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Contribution to NPS u/s 80CCD(1B)</Label><Input type="text" value={displayFormattedCurrency(npsContribution)} onChange={handleInputChange(setNpsContribution)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Medical Insurance Premium u/s 80D</Label><Input type="text" value={displayFormattedCurrency(medicalPremium)} onChange={handleInputChange(setMedicalPremium)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Donation to charity u/s 80G</Label><Input type="text" value={displayFormattedCurrency(donation)} onChange={handleInputChange(setDonation)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Interest on Educational Loan u/s 80E</Label><Input type="text" value={displayFormattedCurrency(educationLoanInterest)} onChange={handleInputChange(setEducationLoanInterest)} disabled={!isOldRegime} /></div>
                                    <div className="space-y-1"><Label>Interest on Deposits u/s 80TTA/TTB</Label><Input type="text" value={displayFormattedCurrency(savingsInterest)} onChange={handleInputChange(setSavingsInterest)} disabled={!isOldRegime} /></div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Button onClick={handleCalculate} className="w-full text-lg">Calculate Tax</Button>
            </div>

            <Card className="lg:col-span-1 h-fit sticky top-24">
                <CardHeader>
                    <CardTitle>Tax & Salary Summary</CardTitle>
                    <CardDescription>Based on the {taxRegime === 'new' ? 'New' : 'Old'} Tax Regime.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    {showResults ? (
                        <>
                            <Card className="p-4 bg-primary/10">
                                <CardDescription>Monthly In-Hand Salary</CardDescription>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(inHandSalary / 12)}</p>
                            </Card>
                             <Card className="p-4">
                                <CardDescription>Total Tax Payable</CardDescription>
                                <p className="text-2xl font-bold">{formatCurrency(taxPayable)}</p>
                            </Card>
                             <Card className="p-4">
                                <CardDescription>Effective Tax Rate</CardDescription>
                                <p className="text-2xl font-bold">{formatPercentage(effectiveTaxRate)}</p>
                            </Card>
                           
                           {isCtcMode && (
                             <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="breakdown">
                                    <AccordionTrigger>View Salary Breakdown</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="text-left space-y-2 text-sm p-2">
                                            <div className="flex justify-between"><span>CTC</span> <span className="font-mono">{formatCurrency(ctc)}</span></div>
                                            <hr className="border-dashed" />
                                            <div className="flex justify-between"><span>Basic Salary</span> <span className="font-mono">{formatCurrency(resultBreakdown.basic)}</span></div>
                                            <div className="flex justify-between"><span>HRA</span> <span className="font-mono">{formatCurrency(resultBreakdown.hra)}</span></div>
                                            <div className="flex justify-between"><span>Special Allowance</span> <span className="font-mono">{formatCurrency(resultBreakdown.specialAllowance)}</span></div>
                                            <div className="flex justify-between"><span>Employer's EPF</span> <span className="font-mono">{formatCurrency(resultBreakdown.employerEpf)}</span></div>
                                            <hr/>
                                            <div className="flex justify-between font-bold"><span>Gross Salary</span> <span className="font-mono">{formatCurrency(resultBreakdown.gross)}</span></div>
                                            <hr className="border-dashed" />
                                             <div className="flex justify-between text-destructive"><span>(-) Income Tax</span> <span className="font-mono">{formatCurrency(resultBreakdown.tax)}</span></div>
                                              <div className="flex justify-between text-destructive"><span>(-) Employee's EPF</span> <span className="font-mono">{formatCurrency(resultBreakdown.employeeEpf)}</span></div>
                                              <div className="flex justify-between text-destructive"><span>(-) Professional Tax</span> <span className="font-mono">{formatCurrency(2500)}</span></div>
                                            <hr/>
                                            <div className="flex justify-between font-bold text-primary"><span>Net In-Hand (Annual)</span> <span className="font-mono">{formatCurrency(resultBreakdown.inHand)}</span></div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                             </Accordion>
                           )}
                        </>
                    ) : (
                        <p className="text-muted-foreground py-12">Click "Calculate Tax" to see your results.</p>
                    )}
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
                <CardTitle>About The Salary & Tax Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    This powerful calculator helps you understand your salary structure and tax liability. You can either enter your Cost-to-Company (CTC) to get an estimated breakdown, or manually enter your income details for a precise calculation. It supports both Old and New Tax Regimes, allowing you to compare and choose the more beneficial option.
                </p>
                <div className="p-4 bg-muted/50 rounded-md">
                    <p className="font-mono text-center text-sm sm:text-base">
                       In-Hand Salary = Gross Salary - Income Tax - Employee's EPF - Other Deductions
                    </p>
                </div>
                 <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">CTC Mode:</span> Provides an estimated breakdown of your salary components based on your CTC. Ideal for a quick overview.</li>
                    <li><span className="font-semibold text-foreground">Manual Mode:</span> Allows you to enter specific income and deduction figures for a more accurate calculation.</li>
                    <li><span className="font-semibold text-foreground">Tax Regimes:</span> Compare the Old Regime (with deductions) and the New Regime (with lower rates but fewer deductions) to see which saves you more money.</li>
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}

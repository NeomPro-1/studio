
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/formatters';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function LoanPrepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  
  const [prepaymentType, setPrepaymentType] = useState('lumpsum');
  const [lumpsumAmount, setLumpsumAmount] = useState(0);
  const [monthlyPrepayment, setMonthlyPrepayment] = useState(0);
  
  // Original Loan
  const [originalEmi, setOriginalEmi] = useState(0);
  const [originalTotalInterest, setOriginalTotalInterest] = useState(0);
  const [originalTotalPayment, setOriginalTotalPayment] = useState(0);

  // New Loan
  const [newTenureMonths, setNewTenureMonths] = useState(0);
  const [newTotalInterest, setNewTotalInterest] = useState(0);
  const [interestSaved, setInterestSaved] = useState(0);
  const [tenureReducedMonths, setTenureReducedMonths] = useState(0);

  const calculateEmi = (p: number, r: number, n: number) => {
    if (p <= 0 || r <= 0 || n <= 0) return 0;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };
  
  useEffect(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const originalMonths = tenure * 12;

    const emi = calculateEmi(principal, monthlyRate, originalMonths);
    setOriginalEmi(emi);
    
    const totalPayment = emi * originalMonths;
    setOriginalTotalPayment(totalPayment);
    const totalInterest = totalPayment - principal;
    setOriginalTotalInterest(totalInterest);

    if (emi > 0) {
        let newBalance = principal;
        let months = 0;
        let totalInterestPaidNew = 0;

        if (prepaymentType === 'lumpsum' && lumpsumAmount > 0) {
            newBalance -= lumpsumAmount;
        }

        while(newBalance > 0) {
            const interest = newBalance * monthlyRate;
            let principalPaid = emi - interest;
            
            if (prepaymentType === 'monthly') {
                principalPaid += monthlyPrepayment;
            }
            
            newBalance -= principalPaid;
            totalInterestPaidNew += interest;
            months++;

            if (newBalance > 2 * principal) { // Break infinite loop
                months = Infinity;
                break;
            }
        }
        
        if (months !== Infinity) {
          setNewTenureMonths(months);
          setNewTotalInterest(totalInterestPaidNew);
          setInterestSaved(totalInterest - totalInterestPaidNew);
          setTenureReducedMonths(originalMonths - months);
        } else {
            setNewTenureMonths(originalMonths);
            setNewTotalInterest(totalInterest);
            setInterestSaved(0);
            setTenureReducedMonths(0);
        }
    }

  }, [loanAmount, interestRate, tenure, prepaymentType, lumpsumAmount, monthlyPrepayment]);

  const formatTenure = (totalMonths: number) => {
    if (totalMonths <= 0 || isNaN(totalMonths) || totalMonths === Infinity) return "0m";
    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12);
    let result = "";
    if (years > 0) result += `${years}y `;
    if (months > 0) result += `${months}m`;
    return result.trim();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Prepayment Calculator</CardTitle>
        <CardDescription>See how much you can save by prepaying your loan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <CardTitle>Loan Details</CardTitle>
                 <div className="space-y-2">
                    <Label htmlFor="loan-amount">Loan Amount</Label>
                    <Input id="loan-amount" type="text" value={formatCurrency(loanAmount)} onChange={(e) => setLoanAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                    <Slider value={[loanAmount]} onValueChange={(vals) => setLoanAmount(vals[0])} min={100000} max={20000000} step={100000} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (% p.a.)</Label>
                    <Input id="interest-rate" type="text" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0)} className="text-lg font-semibold" />
                    <Slider value={[interestRate]} onValueChange={(vals) => setInterestRate(vals[0])} min={5} max={20} step={0.1} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                    <Input id="tenure" type="text" value={tenure} onChange={(e) => setTenure(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                    <Slider value={[tenure]} onValueChange={(vals) => setTenure(vals[0])} min={1} max={30} step={1} />
                </div>
            </div>
             <div className="space-y-6">
                <CardTitle>Prepayment Details</CardTitle>
                <RadioGroup value={prepaymentType} onValueChange={setPrepaymentType} className="flex space-x-4 pt-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lumpsum" id="lumpsum" />
                        <Label htmlFor="lumpsum">One-Time (Lumpsum)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Extra Monthly EMI</Label>
                    </div>
                </RadioGroup>

                {prepaymentType === 'lumpsum' ? (
                    <div className="space-y-2">
                        <Label htmlFor="lumpsum-amount">Lumpsum Amount</Label>
                        <Input id="lumpsum-amount" type="text" value={formatCurrency(lumpsumAmount)} onChange={(e) => setLumpsumAmount(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[lumpsumAmount]} onValueChange={(vals) => setLumpsumAmount(vals[0])} min={0} max={loanAmount} step={10000} />
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="monthly-prepayment">Extra Monthly Payment</Label>
                        <Input id="monthly-prepayment" type="text" value={formatCurrency(monthlyPrepayment)} onChange={(e) => setMonthlyPrepayment(Number(e.target.value.replace(/[^0-9]/g, '')))} className="text-lg font-semibold" />
                        <Slider value={[monthlyPrepayment]} onValueChange={(vals) => setMonthlyPrepayment(vals[0])} min={0} max={originalEmi} step={1000} />
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-4 pt-8">
            <CardTitle className="text-center">Your Savings</CardTitle>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <Card className="bg-primary/10">
                    <CardHeader>
                        <CardDescription>Interest Saved</CardDescription>
                        <p className="text-2xl font-bold text-primary">{formatCurrency(interestSaved)}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Tenure Reduced By</CardDescription>
                        <p className="text-2xl font-bold">{formatTenure(tenureReducedMonths)}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>New Loan Tenure</CardDescription>
                        <p className="text-2xl font-bold">{formatTenure(newTenureMonths)}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Total Interest Paid</CardDescription>
                        <p className="text-2xl font-bold">{formatCurrency(newTotalInterest)}</p>
                    </CardHeader>
                </Card>
            </div>
        </div>
         <Card className="mt-8">
            <CardHeader>
                <CardTitle>About Loan Prepayment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                    A loan prepayment is any extra payment you make towards your loan, over and above your regular EMI. It directly reduces your outstanding principal, which can lead to significant savings on interest and a shorter loan duration. This calculator helps you quantify these benefits, empowering you to make smart financial decisions and become debt-free faster.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li><span className="font-semibold text-foreground">One-Time (Lumpsum):</span> Use this if you have a single large amount to prepay, like a bonus.</li>
                    <li><span className="font-semibold text-foreground">Extra Monthly EMI:</span> Use this to see the effect of consistently paying a little extra each month.</li>
                </ul>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}


"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmiCalculator } from '@/components/calculators/EmiCalculator';
import { LoanPrepaymentCalculator } from './LoanPrepaymentCalculator';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type LoanCalculatorTab = 'home-loan' | 'personal-loan' | 'car-loan';
type BankCalculatorTab = 'sbi' | 'hdfc' | 'axis' | 'icici';


export function LoanCalculators() {
    const [activeLoanTab, setActiveLoanTab] = useState<LoanCalculatorTab>('home-loan');
    const [activeBankTab, setActiveBankTab] = useState<BankCalculatorTab>('sbi');

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Loan EMI Calculators</h1>
                <p className="text-muted-foreground mt-2">Choose a calculator for your specific loan needs.</p>
            </div>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="prepayment">Prepayment</TabsTrigger>
                    <TabsTrigger value="bank-specific">Bank-Specific</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Loan EMI Calculators</CardTitle>
                            <CardDescription>Select a loan type to calculate your EMI.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                               <div className="flex flex-col h-auto justify-start p-1 bg-muted rounded-md text-muted-foreground">
                                    <button onClick={() => setActiveLoanTab('home-loan')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeLoanTab === 'home-loan' && "bg-background text-foreground shadow-sm")}>Home Loan</button>
                                    <button onClick={() => setActiveLoanTab('personal-loan')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeLoanTab === 'personal-loan' && "bg-background text-foreground shadow-sm")}>Personal Loan</button>
                                    <button onClick={() => setActiveLoanTab('car-loan')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeLoanTab === 'car-loan' && "bg-background text-foreground shadow-sm")}>Car Loan</button>
                               </div>
                                <div className="md:col-span-3">
                                    {activeLoanTab === 'home-loan' && (
                                        <EmiCalculator 
                                            key="home-loan" 
                                            title="Home Loan EMI Calculator"
                                            defaultLoanAmount={3000000}
                                            defaultInterestRate={8.5}
                                            defaultTenure={20}
                                        />
                                    )}
                                    {activeLoanTab === 'personal-loan' && (
                                        <EmiCalculator 
                                            key="personal-loan" 
                                            title="Personal Loan EMI Calculator"
                                            defaultLoanAmount={500000}
                                            defaultInterestRate={11}
                                            defaultTenure={5}
                                        />
                                    )}
                                    {activeLoanTab === 'car-loan' && (
                                         <EmiCalculator 
                                            key="car-loan" 
                                            title="Car Loan EMI Calculator"
                                            defaultLoanAmount={800000}
                                            defaultInterestRate={9.5}
                                            defaultTenure={7}
                                         />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="prepayment">
                    <LoanPrepaymentCalculator />
                </TabsContent>
                <TabsContent value="bank-specific">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bank-Specific EMI Calculators</CardTitle>
                            <CardDescription>
                               Calculators tailored for specific banks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex flex-col h-auto justify-start p-1 bg-muted rounded-md text-muted-foreground">
                                    <button onClick={() => setActiveBankTab('sbi')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeBankTab === 'sbi' && "bg-background text-foreground shadow-sm")}>SBI</button>
                                    <button onClick={() => setActiveBankTab('hdfc')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeBankTab === 'hdfc' && "bg-background text-foreground shadow-sm")}>HDFC</button>
                                    <button onClick={() => setActiveBankTab('axis')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeBankTab === 'axis' && "bg-background text-foreground shadow-sm")}>Axis Bank</button>
                                    <button onClick={() => setActiveBankTab('icici')} className={cn("inline-flex items-center justify-start whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", activeBankTab === 'icici' && "bg-background text-foreground shadow-sm")}>ICICI</button>
                                </div>
                                <div className="md:col-span-3">
                                    {activeBankTab === 'sbi' && (
                                        <EmiCalculator 
                                            key="sbi-loan" 
                                            title="SBI Loan EMI Calculator"
                                            defaultLoanAmount={2500000}
                                            defaultInterestRate={8.75}
                                            defaultTenure={20}
                                        />
                                    )}
                                    {activeBankTab === 'hdfc' && (
                                        <EmiCalculator 
                                            key="hdfc-loan" 
                                            title="HDFC Loan EMI Calculator"
                                            defaultLoanAmount={2800000}
                                            defaultInterestRate={8.9}
                                            defaultTenure={20}
                                        />
                                    )}
                                    {activeBankTab === 'axis' && (
                                         <EmiCalculator 
                                            key="axis-loan" 
                                            title="Axis Bank Loan EMI Calculator"
                                            defaultLoanAmount={2200000}
                                            defaultInterestRate={9.1}
                                            defaultTenure={15}
                                         />
                                    )}
                                    {activeBankTab === 'icici' && (
                                         <EmiCalculator 
                                            key="icici-loan" 
                                            title="ICICI Loan EMI Calculator"
                                            defaultLoanAmount={3000000}
                                            defaultInterestRate={9.0}
                                            defaultTenure={20}
                                         />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

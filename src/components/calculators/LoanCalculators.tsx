
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmiCalculator } from '@/components/calculators/EmiCalculator';
import { LoanPrepaymentCalculator } from './LoanPrepaymentCalculator';

export function LoanCalculators() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Loan EMI Calculators</h1>
                <p className="text-muted-foreground mt-2">Choose a calculator for your specific loan needs.</p>
            </div>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General Calculators</TabsTrigger>
                    <TabsTrigger value="prepayment">Prepayment Calculator</TabsTrigger>
                    <TabsTrigger value="bank-specific">Bank-Specific Calculators</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Loan EMI Calculators</CardTitle>
                            <CardDescription>Select a loan type to calculate your EMI.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Tabs defaultValue="home-loan" orientation="vertical">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <TabsList className="flex flex-col h-auto justify-start">
                                        <TabsTrigger value="home-loan" className="w-full justify-start">Home Loan</TabsTrigger>
                                        <TabsTrigger value="personal-loan" className="w-full justify-start">Personal Loan</TabsTrigger>
                                        <TabsTrigger value="car-loan" className="w-full justify-start">Car Loan</TabsTrigger>
                                    </TabsList>
                                    <div className="md:col-span-3">
                                        <TabsContent value="home-loan">
                                            <EmiCalculator 
                                                key="home-loan" 
                                                title="Home Loan EMI Calculator"
                                                defaultLoanAmount={3000000}
                                                defaultInterestRate={8.5}
                                                defaultTenure={20}
                                            />
                                        </TabsContent>
                                        <TabsContent value="personal-loan">
                                            <EmiCalculator 
                                                key="personal-loan" 
                                                title="Personal Loan EMI Calculator"
                                                defaultLoanAmount={500000}
                                                defaultInterestRate={11}
                                                defaultTenure={5}
                                            />
                                        </TabsContent>
                                        <TabsContent value="car-loan">
                                             <EmiCalculator 
                                                key="car-loan" 
                                                title="Car Loan EMI Calculator"
                                                defaultLoanAmount={800000}
                                                defaultInterestRate={9.5}
                                                defaultTenure={7}
                                             />
                                        </TabsContent>
                                    </div>
                                </div>
                            </Tabs>
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
                            <Tabs defaultValue="sbi" orientation="vertical">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <TabsList className="flex flex-col h-auto justify-start">
                                        <TabsTrigger value="sbi" className="w-full justify-start">SBI</TabsTrigger>
                                        <TabsTrigger value="hdfc" className="w-full justify-start">HDFC</TabsTrigger>
                                        <TabsTrigger value="axis" className="w-full justify-start">Axis Bank</TabsTrigger>
                                        <TabsTrigger value="icici" className="w-full justify-start">ICICI</TabsTrigger>
                                    </TabsList>
                                    <div className="md:col-span-3">
                                        <TabsContent value="sbi">
                                            <EmiCalculator 
                                                key="sbi-loan" 
                                                title="SBI Loan EMI Calculator"
                                                defaultLoanAmount={2500000}
                                                defaultInterestRate={8.75}
                                                defaultTenure={20}
                                            />
                                        </TabsContent>
                                        <TabsContent value="hdfc">
                                            <EmiCalculator 
                                                key="hdfc-loan" 
                                                title="HDFC Loan EMI Calculator"
                                                defaultLoanAmount={2800000}
                                                defaultInterestRate={8.9}
                                                defaultTenure={20}
                                            />
                                        </TabsContent>
                                        <TabsContent value="axis">
                                             <EmiCalculator 
                                                key="axis-loan" 
                                                title="Axis Bank Loan EMI Calculator"
                                                defaultLoanAmount={2200000}
                                                defaultInterestRate={9.1}
                                                defaultTenure={15}
                                             />
                                        </TabsContent>
                                        <TabsContent value="icici">
                                             <EmiCalculator 
                                                key="icici-loan" 
                                                title="ICICI Loan EMI Calculator"
                                                defaultLoanAmount={3000000}
                                                defaultInterestRate={9.0}
                                                defaultTenure={20}
                                             />
                                        </TabsContent>
                                    </div>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

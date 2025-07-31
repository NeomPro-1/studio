"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmiCalculator } from '@/components/calculators/EmiCalculator';

export function LoanCalculators() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">Loan EMI Calculators</h1>
                <p className="text-muted-foreground mt-2">Choose a calculator for your specific loan needs.</p>
            </div>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">General Calculators</TabsTrigger>
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
                                            <EmiCalculator title="Home Loan EMI Calculator"/>
                                        </TabsContent>
                                        <TabsContent value="personal-loan">
                                            <EmiCalculator title="Personal Loan EMI Calculator"/>
                                        </TabsContent>
                                        <TabsContent value="car-loan">
                                             <EmiCalculator title="Car Loan EMI Calculator"/>
                                        </TabsContent>
                                    </div>
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="bank-specific">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bank-Specific EMI Calculators</CardTitle>
                            <CardDescription>
                                Coming soon! Calculators tailored for specific banks.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-48">
                            <p className="text-muted-foreground">This section is under construction.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

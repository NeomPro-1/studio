
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/formatters';
import { Slider } from '@/components/ui/slider';

export function GratuityCalculator() {
  const [monthlySalary, setMonthlySalary] = useState(50000);
  const [yearsOfService, setYearsOfService] = useState(10);
  const [gratuity, setGratuity] = useState(0);

  useEffect(() => {
    // As per the Payment of Gratuity Act, any period of service over six months is rounded off to the nearest year.
    const roundedYears = Math.round(yearsOfService);
    
    // The formula for gratuity is (Last Drawn Salary * Number of Years of Service * 15) / 26
    const calculatedGratuity = (monthlySalary * roundedYears * 15) / 26;

    setGratuity(calculatedGratuity);
  }, [monthlySalary, yearsOfService]);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">Gratuity Calculator</h1>
            <p className="text-muted-foreground mt-2">Estimate your gratuity amount upon leaving a job.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="monthly-salary">Monthly Salary (Basic + DA)</Label>
                        <Input
                            id="monthly-salary"
                            type="text"
                            value={formatCurrency(monthlySalary)}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setMonthlySalary(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[monthlySalary]}
                            onValueChange={(vals) => setMonthlySalary(vals[0])}
                            min={10000}
                            max={500000}
                            step={1000}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="years-of-service">Years of Service</Label>
                        <Input
                            id="years-of-service"
                            type="text"
                            value={yearsOfService}
                            onChange={(e) => {
                                const value = Number(e.target.value.replace(/[^0-9]/g, ''));
                                if (!isNaN(value)) setYearsOfService(value);
                            }}
                            className="text-lg font-semibold"
                        />
                        <Slider
                            value={[yearsOfService]}
                            onValueChange={(vals) => setYearsOfService(vals[0])}
                            min={5}
                            max={40}
                            step={1}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <Card className="h-fit">
                    <CardHeader className="text-center p-8">
                        <CardDescription>Estimated Gratuity Amount</CardDescription>
                        <p className="text-4xl font-bold text-primary">{formatCurrency(gratuity)}</p>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>How is Gratuity Calculated?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>
                            Gratuity is a benefit given by an employer to an employee for services rendered to the company. An employee is eligible for gratuity only after completing 5 or more years with the same employer. This calculator helps you estimate the lump sum amount you might receive at the end of your tenure.
                        </p>
                        <div className="p-4 bg-muted/50 rounded-md">
                            <p className="font-mono text-center text-sm sm:text-base">
                                Gratuity = (Last Salary * Years of Service * 15) / 26
                            </p>
                        </div>
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            <li><span className="font-semibold text-foreground">Last Salary:</span> This includes your Basic Salary and Dearness Allowance (DA).</li>
                            <li><span className="font-semibold text-foreground">Years of Service:</span> Any period over 6 months is rounded up to the nearest full year.</li>
                            <li><span className="font-semibold text-foreground">15/26:</span> Represents 15 days salary, based on a 26-day working month.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

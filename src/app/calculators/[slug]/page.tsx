
"use client"

import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CalculatorPageLayout } from '@/components/CalculatorPageLayout';
import { CALCULATORS_MAP } from '@/lib/constants';
import Loading from '@/app/loading';

const calculatorComponents: { [key: string]: React.ComponentType<any> } = {
  'sip': dynamic(() => import('@/components/calculators/SipCalculator').then(mod => mod.SipCalculator), { loading: () => <Loading /> }),
  'step-up-sip': dynamic(() => import('@/components/calculators/StepUpSipCalculator').then(mod => mod.StepUpSipCalculator), { loading: () => <Loading /> }),
  'lumpsum': dynamic(() => import('@/components/calculators/LumpsumCalculator').then(mod => mod.LumpsumCalculator), { loading: () => <Loading /> }),
  'goal-planner': dynamic(() => import('@/components/calculators/GoalPlannerCalculator').then(mod => mod.GoalPlannerCalculator), { loading: () => <Loading /> }),
  'pension': dynamic(() => import('@/components/calculators/PensionCalculator').then(mod => mod.PensionCalculator), { loading: () => <Loading /> }),
  'fd': dynamic(() => import('@/components/calculators/FdCalculator').then(mod => mod.FdCalculator), { loading: () => <Loading /> }),
  'simple-interest': dynamic(() => import('@/components/calculators/SimpleInterestCalculator').then(mod => mod.SimpleInterestCalculator), { loading: () => <Loading /> }),
  'compound-interest': dynamic(() => import('@/components/calculators/CompoundInterestCalculator').then(mod => mod.CompoundInterestCalculator), { loading: () => <Loading /> }),
  'ppf': dynamic(() => import('@/components/calculators/PpfCalculator').then(mod => mod.PpfCalculator), { loading: () => <Loading /> }),
  'swp': dynamic(() => import('@/components/calculators/SwpCalculator').then(mod => mod.SwpCalculator), { loading: () => <Loading /> }),
  'roi': dynamic(() => import('@/components/calculators/RoiCalculator').then(mod => mod.RoiCalculator), { loading: () => <Loading /> }),
  'xirr': dynamic(() => import('@/components/calculators/XirrCalculator').then(mod => mod.XirrCalculator), { loading: () => <Loading /> }),
  'cagr': dynamic(() => import('@/components/calculators/CagrCalculator').then(mod => mod.CagrCalculator), { loading: () => <Loading /> }),
  'epf': dynamic(() => import('@/components/calculators/EpfCalculator').then(mod => mod.EpfCalculator), { loading: () => <Loading /> }),
  'gratuity': dynamic(() => import('@/components/calculators/GratuityCalculator').then(mod => mod.GratuityCalculator), { loading: () => <Loading /> }),
  'hlv': dynamic(() => import('@/components/calculators/HlvCalculator').then(mod => mod.HlvCalculator), { loading: () => <Loading /> }),
  'emi': dynamic(() => import('@/components/calculators/EmiCalculator').then(mod => mod.EmiCalculator), { loading: () => <Loading /> }),
  'mortgage': dynamic(() => import('@/components/calculators/MortgageCalculator').then(mod => mod.MortgageCalculator), { loading: () => <Loading /> }),
  'loan': dynamic(() => import('@/components/calculators/LoanCalculators').then(mod => mod.LoanCalculators), { loading: () => <Loading /> }),
  'gst': dynamic(() => import('@/components/calculators/GstCalculator').then(mod => mod.GstCalculator), { loading: () => <Loading /> }),
  'inflation': dynamic(() => import('@/components/calculators/InflationCalculator').then(mod => mod.InflationCalculator), { loading: () => <Loading /> }),
  'tax': dynamic(() => import('@/components/calculators/TaxCalculator').then(mod => mod.TaxCalculator), { loading: () => <Loading /> }),
  'real-estate-vs-mf': dynamic(() => import('@/components/calculators/RealEstateVsMfCalculator').then(mod => mod.RealEstateVsMfCalculator), { loading: () => <Loading /> }),
};


export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const calculatorInfo = useMemo(() => CALCULATORS_MAP.get(slug), [slug]);

  if (!calculatorInfo) {
    notFound();
  }

  const CalculatorComponent = calculatorComponents[slug];

  if (!CalculatorComponent) {
    notFound();
  }

  return (
    <CalculatorPageLayout>
      <CalculatorComponent />
    </CalculatorPageLayout>
  );
}

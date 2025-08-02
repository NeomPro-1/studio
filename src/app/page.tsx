
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { CALCULATORS } from '@/lib/constants';
import { Header } from '@/components/Header';
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            Your Friendly Financial Guide
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Quickly calculate your investments, loans, and taxes with our simple and powerful tools.
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATORS.map((calculator) => (
            <Link href={calculator.path} key={calculator.path} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 hover:border-primary/50 flex flex-col">
                <CardHeader className="flex-grow">
                  <div className="flex items-center mb-4">
                    <calculator.icon className="w-8 h-8 mr-4 text-primary" />
                    <CardTitle className="font-headline">{calculator.name}</CardTitle>
                  </div>
                  <CardDescription>{calculator.description}</CardDescription>
                </CardHeader>
                <div className="p-4 pt-0">
                  <div className="flex justify-end items-center text-sm font-semibold text-primary transition-all duration-300 group-hover:brightness-125">
                    Calculate
                    <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <footer className="text-center py-6 text-muted-foreground text-sm">
        <div className="container mx-auto">
          <p className="mb-2">&copy; {new Date().getFullYear()} GrowthCalculator. All rights reserved.</p>
          <Separator className="my-2 max-w-xs mx-auto" />
          <div className="flex justify-center items-center gap-4">
            <Link href="/about" className="hover:text-primary hover:underline">About Us</Link>
            <Link href="/disclaimer" className="hover:text-primary hover:underline">Disclaimer</Link>
            <Link href="/terms" className="hover:text-primary hover:underline">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

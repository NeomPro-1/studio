"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/use-debounce';
import { smartCalculatorSearch } from '@/ai/flows/smart-calculator-search';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Loader2, Search } from 'lucide-react';
import { CALCULATORS_MAP } from '@/lib/constants';

export function SmartSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();

  useEffect(() => {
    if (debouncedQuery.length > 1) {
      startTransition(async () => {
        const result = await smartCalculatorSearch({ query: debouncedQuery });
        setSuggestions(result.suggestions);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    if (query.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  const handleSelect = (suggestion: string) => {
    const path = CALCULATORS_MAP.get(suggestion)?.path;
    if (path) {
      router.push(path);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search calculators..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
            />
            {isPending && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
            <CommandList>
                {suggestions.length === 0 && query.length > 1 && !isPending && (
                    <CommandEmpty>No results found.</CommandEmpty>
                )}
                {suggestions.length > 0 && (
                    <CommandGroup heading="Suggestions">
                        {suggestions.map((suggestion) => (
                            <CommandItem key={suggestion} onSelect={() => handleSelect(suggestion)} value={suggestion}>
                                {suggestion}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

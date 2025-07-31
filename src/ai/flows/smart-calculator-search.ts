'use server';

/**
 * @fileOverview A smart calculator search AI agent.
 *
 * - smartCalculatorSearch - A function that suggests relevant calculators based on user input.
 * - SmartCalculatorSearchInput - The input type for the smartCalculatorSearch function.
 * - SmartCalculatorSearchOutput - The return type for the smartCalculatorSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { CALCULATORS } from '@/lib/constants';

const calculatorNames = CALCULATORS.map(c => c.name);

const SmartCalculatorSearchInputSchema = z.object({
  query: z.string().describe('The user search query.'),
});
export type SmartCalculatorSearchInput = z.infer<
  typeof SmartCalculatorSearchInputSchema
>;

const SmartCalculatorSearchOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested calculators based on the query.'),
});
export type SmartCalculatorSearchOutput = z.infer<
  typeof SmartCalculatorSearchOutputSchema
>;

export async function smartCalculatorSearch(
  input: SmartCalculatorSearchInput
): Promise<SmartCalculatorSearchOutput> {
  return smartCalculatorSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartCalculatorSearchPrompt',
  input: {schema: SmartCalculatorSearchInputSchema},
  output: {schema: SmartCalculatorSearchOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant calculators based on a user's search query.

  The available calculators are:
  ${calculatorNames.join('\n')}

  Given the following query, suggest up to 5 relevant calculators from the list above.

  Query: {{{query}}}

  Format your response as a JSON object with a "suggestions" field that is an array of strings. Only include calculator names from the provided list.
  `,
});

const smartCalculatorSearchFlow = ai.defineFlow(
  {
    name: 'smartCalculatorSearchFlow',
    inputSchema: SmartCalculatorSearchInputSchema,
    outputSchema: SmartCalculatorSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

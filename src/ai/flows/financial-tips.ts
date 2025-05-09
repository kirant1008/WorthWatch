// src/ai/flows/financial-tips.ts
'use server';

/**
 * @fileOverview Generates personalized financial tips based on user's financial data.
 *
 * - getFinancialTips - A function that generates financial advice.
 * - FinancialTipsInput - The input type for the getFinancialTips function.
 * - FinancialTipsOutput - The return type for the getFinancialTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialTipsInputSchema = z.object({
  assets: z.number().describe('The total value of the user\'s assets.'),
  liabilities: z.number().describe('The total value of the user\'s liabilities.'),
  financialGoals: z.string().describe('The user\'s financial goals.'),
});
export type FinancialTipsInput = z.infer<typeof FinancialTipsInputSchema>;

const FinancialTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of personalized financial tips.'),
});
export type FinancialTipsOutput = z.infer<typeof FinancialTipsOutputSchema>;

export async function getFinancialTips(input: FinancialTipsInput): Promise<FinancialTipsOutput> {
  return financialTipsFlow(input);
}

const financialTipsPrompt = ai.definePrompt({
  name: 'financialTipsPrompt',
  input: {schema: FinancialTipsInputSchema},
  output: {schema: FinancialTipsOutputSchema},
  prompt: `You are a financial advisor providing personalized financial tips.

  Based on the user's current financial situation and goals, provide a list of actionable tips.

  Assets: {{assets}}
  Liabilities: {{liabilities}}
  Financial Goals: {{financialGoals}}

  Tips:`, // Ensure this is valid Handlebars syntax
});

const financialTipsFlow = ai.defineFlow(
  {
    name: 'financialTipsFlow',
    inputSchema: FinancialTipsInputSchema,
    outputSchema: FinancialTipsOutputSchema,
  },
  async input => {
    const {output} = await financialTipsPrompt(input);
    return output!;
  }
);

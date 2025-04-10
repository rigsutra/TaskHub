// src/ai/flows/suggest-meta-tags.ts
'use server';

/**
 * @fileOverview AI-powered meta tag suggestion for task categorization.
 *
 * This file defines a Genkit flow that suggests relevant meta tags based on a task description.
 *
 * @function suggestMetaTags - The main function to trigger the meta tag suggestion flow.
 * @interface SuggestMetaTagsInput - Defines the input schema for the suggestMetaTags function.
 * @interface SuggestMetaTagsOutput - Defines the output schema for the suggestMetaTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestMetaTagsInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task.'),
});
export type SuggestMetaTagsInput = z.infer<typeof SuggestMetaTagsInputSchema>;

const SuggestMetaTagsOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .max(5)
    .describe('An array of suggested meta tags (maximum 5) for the task.'),
});
export type SuggestMetaTagsOutput = z.infer<typeof SuggestMetaTagsOutputSchema>;

export async function suggestMetaTags(input: SuggestMetaTagsInput): Promise<SuggestMetaTagsOutput> {
  return suggestMetaTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMetaTagsPrompt',
  input: {
    schema: z.object({
      taskDescription: z.string().describe('The description of the task.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedTags: z
        .array(z.string())
        .max(5)
        .describe('An array of suggested meta tags (maximum 5) for the task.'),
    }),
  },
  prompt: `You are an AI assistant designed to suggest relevant meta tags for a given task description.

  Given the following task description, generate a list of up to 5 meta tags that would be helpful for categorizing and searching for the task. Return the tags as a simple array of strings.

  Task Description: {{{taskDescription}}}

  The tags should be relevant to the task and help users find it when searching. Focus on tags that describe the task's purpose, required skills, or target audience.`,
});

const suggestMetaTagsFlow = ai.defineFlow<
  typeof SuggestMetaTagsInputSchema,
  typeof SuggestMetaTagsOutputSchema
>({
  name: 'suggestMetaTagsFlow',
  inputSchema: SuggestMetaTagsInputSchema,
  outputSchema: SuggestMetaTagsOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});

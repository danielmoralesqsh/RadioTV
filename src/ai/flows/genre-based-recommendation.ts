// This is a server-side file.
'use server';

/**
 * @fileOverview Provides radio station and TV channel recommendations based on a given genre description.
 *
 * - `getGenreBasedRecommendations` -  A function that takes a genre description and returns recommendations for radio stations or TV channels.
 * - `GenreBasedRecommendationsInput` - The input type for the `getGenreBasedRecommendations` function.
 * - `GenreBasedRecommendationsOutput` - The return type for the `getGenreBasedRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenreBasedRecommendationsInputSchema = z.object({
  genreDescription: z.string().describe('A description of the desired genre or mood.'),
  mediaType: z.enum(['radio', 'tv']).describe('The type of media to provide recommendations for.'),
});
export type GenreBasedRecommendationsInput = z.infer<typeof GenreBasedRecommendationsInputSchema>;

const GenreBasedRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.string().describe('A recommended radio station or TV channel.')
  ).describe('A list of radio stations or TV channels that match the genre description.'),
});
export type GenreBasedRecommendationsOutput = z.infer<typeof GenreBasedRecommendationsOutputSchema>;

export async function getGenreBasedRecommendations(
  input: GenreBasedRecommendationsInput
): Promise<GenreBasedRecommendationsOutput> {
  return genreBasedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'genreBasedRecommendationsPrompt',
  input: {
    schema: GenreBasedRecommendationsInputSchema,
  },
  output: {
    schema: GenreBasedRecommendationsOutputSchema,
  },
  prompt: `You are a media expert who suggests radio stations or TV channels based on genre descriptions.

  The user will provide a description of a genre or mood, and you should provide a list of relevant radio stations or TV channels.
  The user will also specify whether they are looking for radio stations or TV channels. Only suggest the media type requested.

  Here is the genre description: {{{genreDescription}}}
  Here is the media type: {{{mediaType}}}

  Provide a list of recommendations that match the description and media type.
  `, 
});

const genreBasedRecommendationsFlow = ai.defineFlow(
  {
    name: 'genreBasedRecommendationsFlow',
    inputSchema: GenreBasedRecommendationsInputSchema,
    outputSchema: GenreBasedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

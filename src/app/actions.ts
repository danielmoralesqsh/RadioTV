'use server';

import { z } from 'zod';
import { getGenreBasedRecommendations } from '@/ai/flows/genre-based-recommendation';

const FormSchema = z.object({
  genreDescription: z.string().min(10, 'Please describe the genre in at least 10 characters.'),
  mediaType: z.enum(['radio', 'tv']),
});

export type FormState = {
  message?: string;
  recommendations?: string[];
  error?: string;
};

export async function handleGenreRecommendation(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const validatedFields = FormSchema.safeParse({
      genreDescription: formData.get('genreDescription'),
      mediaType: formData.get('mediaType'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please check your entries.',
      };
    }

    const { genreDescription, mediaType } = validatedFields.data;

    const result = await getGenreBasedRecommendations({ genreDescription, mediaType });

    if (!result.recommendations || result.recommendations.length === 0) {
      return { message: 'No recommendations found for your description. Try being more specific!' };
    }

    return { recommendations: result.recommendations, message: `Here are some ${mediaType} recommendations for you:` };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}

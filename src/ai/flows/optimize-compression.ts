'use server';

/**
 * @fileOverview An AI agent that optimizes the compression level of a JPEG image.
 *
 * - optimizeCompression - A function that optimizes the compression level of a JPEG image.
 * - OptimizeCompressionInput - The input type for the optimizeCompression function.
 * - OptimizeCompressionOutput - The return type for the optimizeCompression function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCompressionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A JPEG image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OptimizeCompressionInput = z.infer<typeof OptimizeCompressionInputSchema>;

const OptimizeCompressionOutputSchema = z.object({
  optimizedImageDataUri: z
    .string()
    .describe(
      'The optimized JPEG image, as a data URI with optimized compression to balance file size and visual quality.'
    ),
});
export type OptimizeCompressionOutput = z.infer<typeof OptimizeCompressionOutputSchema>;

export async function optimizeCompression(input: OptimizeCompressionInput): Promise<OptimizeCompressionOutput> {
  return optimizeCompressionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCompressionPrompt',
  input: {schema: OptimizeCompressionInputSchema},
  output: {schema: OptimizeCompressionOutputSchema},
  prompt: `You are an expert image compression specialist.

You will receive a JPEG image as a data URI. Your task is to analyze the image and determine the optimal compression level that minimizes the file size while maintaining acceptable visual quality. Return the optimized JPEG image as a data URI.

Input Image: {{media url=imageDataUri}}

Consider factors such as color complexity, image resolution, and perceived visual quality when determining the compression level. The goal is to reduce the file size as much as possible without introducing noticeable artifacts or significant loss of detail.

Ensure that the output is a valid data URI representing the optimized JPEG image.

Output the optimized image as a data URI in the optimizedImageDataUri field.
`,
});

const optimizeCompressionFlow = ai.defineFlow(
  {
    name: 'optimizeCompressionFlow',
    inputSchema: OptimizeCompressionInputSchema,
    outputSchema: OptimizeCompressionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

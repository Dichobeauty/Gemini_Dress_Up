import { GoogleGenAI, Modality } from "@google/genai";

interface ImageInput {
  base64: string;
  mimeType: string;
  width?: number;
  height?: number;
}

interface ClothingItemInput extends ImageInput {}

export const dressUpPerson = async (
  person: ImageInput,
  clothingItems: ClothingItemInput[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const personPart = {
    inlineData: {
      data: person.base64,
      mimeType: person.mimeType,
    },
  };

  const clothingParts = clothingItems.map(item => ({
    inlineData: {
      data: item.base64,
      mimeType: item.mimeType,
    },
  }));
  
  // A highly structured, step-by-step prompt to guide the model precisely and reduce errors.
  const textPart = {
    text: `
Objective: Edit the first image (the person). Do not generate a new person or background.

Instructions:
1.  **Analyze Person Image:** The first image contains a person. Identify their exact pose, facial features, body shape, and the background. These elements MUST remain unchanged.
2.  **Analyze Clothing Images:** The subsequent images are new clothing items and/or accessories.
3.  **Perform Edit:** Modify the Person Image. Your only task is to completely REMOVE their original clothing and photorealistically place the new clothing items onto them.
4.  **CRITICAL RULE - NO MERGING:** Do NOT blend, merge, or layer the new items with the original clothes. The original clothes must be fully replaced.
5.  **CRITICAL RULE - PRESERVE LIKENESS:** The person's likeness must be 100% preserved. No distortion to their face or body.
6.  **Output Requirements:**
    - The final image must be photorealistic.
    - The final image dimensions must be EXACTLY ${person.width}x${person.height} pixels.
`};

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          personPart,
          ...clothingParts,
          textPart,
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Handle cases where the API call succeeds but returns no content, e.g., due to safety filters.
    if (!response.candidates || response.candidates.length === 0) {
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        const reasonText = blockReason.toLowerCase().replace(/_/g, ' ');
        throw new Error(`Request blocked due to safety settings: ${reasonText}. Please try with different images.`);
      }
      throw new Error("The model did not return any content. This could be due to the prompt or safety filters.");
    }

    const firstCandidate = response.candidates[0];
    
    // Safely access the image data from the first candidate.
    const imagePart = firstCandidate?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const mimeType: string = imagePart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
    
    // If no image was found, check for a text response from the model to provide a more specific error.
    const responseTextPart = firstCandidate?.content?.parts?.find(p => p.text);
    if (responseTextPart?.text) {
        throw new Error(`The model returned a text message instead of an image: "${responseTextPart.text}"`);
    }
    
    // Fallback error if no image and no text are found.
    throw new Error("No image was generated. The model's response did not contain image data.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
         throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
};

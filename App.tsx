
import React, { useState, useCallback } from 'react';
import { dressUpPerson } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { PersonIcon, ShirtIcon, TrashIcon, SparklesIcon } from './components/Icons';

interface ClothingItem {
  id: number;
  base64: string;
  mimeType: string;
}

/**
 * Checks if a generated image matches target dimensions and resizes it if necessary.
 * @param base64Image The base64 string of the image to check.
 * @param targetWidth The desired width.
 * @param targetHeight The desired height.
 * @returns A promise that resolves with the correctly-sized image as a base64 string.
 */
const resizeImageIfNeeded = (
  base64Image: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // If dimensions already match, no need to resize.
      if (img.naturalWidth === targetWidth && img.naturalHeight === targetHeight) {
        resolve(base64Image);
        return;
      }

      console.warn(`Discrepancy detected. Resizing generated image from ${img.naturalWidth}x${img.naturalHeight} to ${targetWidth}x${targetHeight}.`);

      // Create an off-screen canvas to perform the resize.
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Failed to create canvas context for resizing.'));
      }
      
      // Draw the image onto the canvas, scaling it to the target dimensions.
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Get the mime type from the original base64 string to preserve the format.
      const mimeType = base64Image.substring(5, base64Image.indexOf(';'));
      resolve(canvas.toDataURL(mimeType));
    };
    img.onerror = () => {
      reject(new Error('Could not load the generated image to check its dimensions.'));
    };
    img.src = base64Image;
  });
};

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<{ base64: string, mimeType: string, width: number, height: number } | null>(null);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePersonImageUpload = useCallback((base64: string, mimeType: string, width: number, height: number) => {
    setPersonImage({ base64, mimeType, width, height });
  }, []);

  const removePersonImage = useCallback(() => {
    setPersonImage(null);
  }, []);

  const handleClothingImageUpload = useCallback((base64: string, mimeType: string, _width: number, _height: number) => {
    // Width and height are not needed for clothing items, but the uploader provides them.
    setClothingItems(prev => [...prev, { id: Date.now(), base64, mimeType }]);
  }, []);

  const removeClothingItem = (id: number) => {
    setClothingItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleDressUp = async () => {
    if (!personImage || clothingItems.length === 0) {
      setError('Please upload a photo of a person and at least one clothing item.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const rawGeneratedImage = await dressUpPerson(personImage, clothingItems);
      // Verify and resize the image if its dimensions don't match the source.
      const finalImage = await resizeImageIfNeeded(rawGeneratedImage, personImage.width, personImage.height);
      setGeneratedImage(finalImage);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AI Dress Up Studio
          </h1>
          <p className="mt-2 text-lg text-gray-400">Upload a photo, add your clothes, and see the magic happen!</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Inputs */}
          <div className="flex flex-col gap-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><PersonIcon /> Step 1: Upload a Person</h2>
              <ImageUploader 
                onImageUpload={handlePersonImageUpload}
                preview={personImage ? `data:${personImage.mimeType};base64,${personImage.base64}` : null}
                onRemove={removePersonImage}
              />
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><ShirtIcon /> Step 2: Add Clothing Items</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {clothingItems.map(item => (
                  <div key={item.id} className="relative group aspect-square">
                    <img src={`data:${item.mimeType};base64,${item.base64}`} alt="Clothing item" className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => removeClothingItem(item.id)}
                      className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove item"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
                <ImageUploader onImageUpload={handleClothingImageUpload} isCompact={true} />
              </div>
            </div>

            <button
              onClick={handleDressUp}
              disabled={isLoading || !personImage || clothingItems.length === 0}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <SparklesIcon />
              Dress Up!
            </button>

            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
          </div>

          {/* Right Side: Output */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 self-start flex items-center gap-3"><SparklesIcon /> Step 3: See the Result</h2>
            <div className="w-full flex-1 flex items-center justify-center">
              {isLoading && (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
                  <p className="text-gray-400">Generating your new look...</p>
                </div>
              )}
              {!isLoading && generatedImage && (
                <img key={generatedImage} src={generatedImage} alt="Generated result" className="max-w-full max-h-full object-contain rounded-lg" />
              )}
              {!isLoading && !generatedImage && (
                <div className="text-center text-gray-500">
                  <p>Your generated image will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

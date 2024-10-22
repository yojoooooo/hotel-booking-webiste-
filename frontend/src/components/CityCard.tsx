import React, { useState, useEffect } from 'react';

interface CityCardProps {
  city: string;
  country: string;
  hotelCount: number;
}

const API_KEY = 'AIzaSyAU8iVUxwMN4FoWxnKwcEUe-cFsBTq1j6c';  // Replace with your Google API key
const CX = '14b0a9e3379474aca';  // Your Custom Search Engine ID

const CityCard: React.FC<CityCardProps> = ({ city, country, hotelCount }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageCache, setImageCache] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchImage = async () => {
      const cacheKey = `${city},${country}`;

      // Check if the image is already cached
      if (imageCache[cacheKey]) {
        setImageUrl(imageCache[cacheKey]);
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/customsearch/v1?q=${city}+${country}&cx=${CX}&key=${API_KEY}&searchType=image&num=1`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const imageUrl = data.items[0].link;
          setImageUrl(imageUrl);
          // Store the image in cache
          setImageCache((prevCache) => ({ ...prevCache, [cacheKey]: imageUrl }));
        } else {
          console.warn('No images found for:', city, country);
          setImageUrl('https://via.placeholder.com/500'); // Placeholder if no images
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageUrl('https://via.placeholder.com/500'); // Placeholder on error
      }
    };

    if (city && country) {
      fetchImage();
    }
  }, [city, country, imageCache]); 

  return (
    <div className="border p-4 rounded-lg shadow-md">
      {imageUrl && (
        <img src={imageUrl} alt={`${city}, ${country}`} className="w-full h-40 object-cover rounded-lg" />
      )}
      <h3 className="text-xl font-semibold mt-2">{city}</h3>
      <p className="text-gray-600">{hotelCount} hotels available</p>
    </div>
  );
};

export default CityCard;
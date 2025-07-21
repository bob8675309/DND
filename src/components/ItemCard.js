import React, { useEffect, useState } from 'react';

const rarityStyles = {
  Common: 'border border-gray-500 bg-gray-100',
  Uncommon: 'border border-green-600 bg-green-50',
  Rare: 'border border-red-600 bg-red-50',
  'Very Rare': 'border border-purple-600 bg-purple-50',
  Legendary: 'border border-yellow-600 bg-yellow-50',
  Artifact: 'border border-blue-800 bg-blue-50',
  Homebrew: 'border border-lime-700 bg-lime-100',
};

const generateFlavor = (item) => {
  if (!item?.name) return 'An item of strange and unknown origin.';
  const base = item.name.toLowerCase();
  if (base.includes('sword') || base.includes('blade')) {
    return 'This blade hums with the echo of ancient battles.';
  }
  if (base.includes('potion') || item.type === 'Potion') {
    return 'A vial shimmering like frozen moonlight.';
  }
  if (base.includes('ring')) {
    return 'It tightens as if aware of your thoughts.';
  }
  if (base.includes('amulet')) {
    return 'This amulet pulses in tune with your heartbeat.';
  }
  if (item.type === 'Wondrous Item') {
    return 'An item of peculiar nature and unpredictable effect.';
  }
  return 'An item of strange and unknown origin.';
};

const useGeneratedImage = (item) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!item || !item.name) return;
    const fetchImage = async () => {
      try {
        const prompt = `A D&D fantasy item called ${item.name}. ${item.flavor || generateFlavor(item)}`;
        const res = await fetch('/api/gen-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        if (data?.url) setUrl(data.url);
      } catch (e) {
        console.error('Image generation failed', e);
      }
    };
    fetchImage();
  }, [item]);

  return url;
};

export default function ItemCard({ item }) {
  if (!item) return null;

  const colorClass = rarityStyles[item.rarity] || 'border border-gray-400 bg-white';
  const flavor = item.flavor || generateFlavor(item);
  const aiImage = useGeneratedImage(item);
  const image = item.img || aiImage || 'https://via.placeholder.com/64x64.png?text=Item';

  return (
    <div className={`w-full rounded-md shadow-xl overflow-hidden text-black border-4 ${colorClass}`}>
      {/* Header */}
      <div className="text-white text-center text-lg font-extrabold py-2 px-3" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
        {item.name}
      </div>
      {/* Rarity Bar */}
      <div className="text-center italic text-sm py-1 text-red-700 font-semibold">
        {item.rarity || 'Unknown Rarity'}
      </div>
      {/* Flavor and Image */}
      <div className="flex px-3 gap-2 border-y border-dashed border-gray-400 bg-white">
        <div className="italic text-gray-700 text-sm py-2 w-3/4">
          {flavor}
        </div>
        <div className="w-1/4 flex items-center justify-center p-2">
          <img
            src={image}
            alt={item.name || 'Item'}
            className="object-contain max-h-16 border border-gray-300 rounded"
          />
        </div>
      </div>
      {/* Description */}
      <div className="text-sm px-3 py-2 whitespace-pre-wrap bg-white">
        {item.description || 'No description available.'}
      </div>
      {/* Footer */}
      <div className="flex justify-between text-xs bg-gray-100 px-3 py-1 border-t border-black font-semibold">
        <span>{item.type || 'Item'}{item.slot ? ` — ${item.slot}` : ''}</span>
        <span className="italic text-right">{item.rarity}</span>
      </div>
    </div>
  );
}

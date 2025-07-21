import React, { useEffect, useState } from "react";

const ItemCard = ({ item }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!item?.name) return;
    let isMounted = true; // To prevent setting state after unmount
    setLoading(true);
    setError("");
    setImageUrl(null);

    const fetchImage = async () => {
      try {
        const res = await fetch("/api/gen-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: item.name }),
        });
        if (!res.ok) throw new Error("Image generation failed");
        const data = await res.json();
        if (isMounted) setImageUrl(data.imageUrl || null);
      } catch (err) {
        if (isMounted) setError("Image not available");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();
    return () => { isMounted = false; };
  }, [item?.name]);

  if (!item) return null;

  return (
    <div className="item-card p-4 bg-zinc-900 rounded-2xl shadow-xl max-w-md mx-auto my-4 border border-zinc-700">
      <div className="flex flex-col items-center">
        <div className="w-full text-center">
          <h2 className="font-bold text-xl text-white mb-1">{item.name}</h2>
          <span className={`text-sm italic font-semibold ${item.rarity === 'rare' ? 'text-red-400' : 'text-gray-400'}`}>
            {item.rarity}
          </span>
        </div>

        <div className="w-40 h-40 my-4 flex items-center justify-center bg-zinc-800 rounded-xl border border-zinc-700">
          {loading && <span className="text-xs text-gray-500">Loading image…</span>}
          {!loading && imageUrl && (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-contain rounded-lg"
            />
          )}
          {!loading && !imageUrl && (
            <span className="text-xs text-gray-600">{error || "No image"}</span>
          )}
        </div>

        <div className="w-full text-center">
          <p className="text-gray-300 text-base mb-2">{item.description}</p>
          <div className="flex justify-center gap-3 mt-2 text-xs text-zinc-400">
            <span>Type: {item.type || "—"}</span>
            <span>Slot: {item.slot || "—"}</span>
            <span>Value: {item.value ? `${item.value} gp` : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

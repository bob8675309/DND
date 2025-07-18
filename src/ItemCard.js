import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ItemCard({ item }) {
  return (
    <div className="max-w-sm w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden m-4">
      {/* Header */}
      <div className="bg-gray-100 px-4 py-3">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {item.type} – {item.rarity}
        </p>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <ReactMarkdown className="prose prose-sm text-gray-700">
          {item.description}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
        <span className="text-xs text-gray-500">Weight: {item.weight ?? 'N/A'}</span>
        <span className="text-xs font-medium text-gray-600">{item.cost ?? '—'}</span>
      </div>
    </div>
  );
}
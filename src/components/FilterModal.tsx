import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { maxPrice: number; expressOnly: boolean }) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters
}) => {
  const [maxPrice, setMaxPrice] = useState(1000);
  const [expressOnly, setExpressOnly] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyFilters({ maxPrice, expressOnly });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#dfe2e9] animate-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#dfe2e9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1a237e]">tune</span>
            <h3 className="text-sm font-bold text-[#181c21]">फ़िल्टर व छंटनी</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f1f4fb] flex items-center justify-center text-[#454652]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-[#181c21] mb-1.5">
              <span>अधिकतम बजट सीमा</span>
              <span className="text-[#1a237e]">₹{maxPrice} तक</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-[#1a237e]"
            />
            <div className="flex justify-between text-[10px] text-[#767683] mt-1">
              <span>₹100</span>
              <span>₹1,500+</span>
            </div>
          </div>

          <div className="bg-[#f7f9ff] p-3 rounded-2xl border border-[#dfe2e9] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#181c21] block">केवल एक्सप्रेस डिलीवरी (4 घंटे)</span>
              <span className="text-[10px] text-[#767683]">तत्काल प्राथमिकता सेवा</span>
            </div>
            <input
              type="checkbox"
              checked={expressOnly}
              onChange={(e) => setExpressOnly(e.target.checked)}
              className="w-4 h-4 text-[#1a237e] rounded"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-[#f1f4fb]">
          <button
            onClick={onClose}
            className="flex-1 bg-[#f1f4fb] text-[#454652] py-2.5 rounded-full text-xs font-bold"
          >
            रीसेट करें
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-[#1a237e] text-white py-2.5 rounded-full text-xs font-bold shadow-xs"
          >
            लागू करें
          </button>
        </div>

      </div>
    </div>
  );
};

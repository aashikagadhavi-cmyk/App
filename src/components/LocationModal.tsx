import React from 'react';
import { CITIES_LIST } from '../data/mockData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#dfe2e9] animate-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#dfe2e9]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1b6d24]">location_on</span>
            <h3 className="text-sm font-bold text-[#181c21]">डिलीवरी शहर चुनें</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f1f4fb] flex items-center justify-center text-[#454652]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="py-3 flex flex-col gap-2 max-h-80 overflow-y-auto">
          {CITIES_LIST.map((item) => {
            const isSelected = selectedCity.includes(item.city);

            return (
              <div
                key={item.city}
                onClick={() => {
                  onSelectCity(`${item.city} (${item.state})`);
                  onClose();
                }}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#e0e0ff] border-[#1a237e]'
                    : 'bg-[#f7f9ff] hover:bg-white border-[#dfe2e9]'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#181c21]">{item.city}</h4>
                  <p className="text-[10px] text-[#767683]">{item.hub}</p>
                </div>
                {isSelected ? (
                  <span className="material-symbols-outlined text-[#1a237e] text-[20px]">check_circle</span>
                ) : (
                  <span className="material-symbols-outlined text-[#dfe2e9] text-[20px]">radio_button_unchecked</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-[#f1f4fb] text-center">
          <p className="text-[10px] text-[#767683]">
            पहाड़ी एक्सप्रेस कोल्ड-चेन लॉजिस्टिक्स द्वारा 24–48 घंटे में ताज़ा डिलीवरी।
          </p>
        </div>

      </div>
    </div>
  );
};

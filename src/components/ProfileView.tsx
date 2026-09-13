import React, { useState } from 'react';
import { USER_AVATAR_URL } from '../data/mockData';

interface ProfileViewProps {
  selectedCity: string;
  onOpenLocationModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ selectedCity, onOpenLocationModal }) => {
  const [coinsBalance, setCoinsBalance] = useState(450);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('HIMALAYA2026');
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Banner */}
      <div className="bg-[#1a237e] text-white px-4 sm:px-5 pt-3 pb-8 rounded-b-[28px] shadow-[0_12px_28px_rgba(26,35,126,0.25)]">
        <div className="max-w-md mx-auto flex items-center gap-3.5">
          <div className="relative">
            <img
              src={USER_AVATAR_URL}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#a3f69c] shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#1b6d24] rounded-full ring-2 ring-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-bold text-white">हिमधारा फूड्स व डिजिटल स्टूडियो</h2>
              <span className="material-symbols-outlined text-[#F59E0B] text-[18px] material-symbols-filled">
                verified
              </span>
            </div>
            <p className="text-xs text-[#8690ee]">himdhara.foods@gmail.com</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="bg-[#a3f69c] text-[#002204] text-[10px] font-bold px-2 py-0.5 rounded-full">
                जेनिथ गोल्ड सदस्य
              </span>
              <span className="text-[11px] text-white/80">आईडी #ZH-5910</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 sm:px-5 -mt-4 flex flex-col gap-4">
        
        {/* Himalayan Coins Loyalty Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_8px_20px_rgba(26,35,126,0.08)] border border-[#dfe2e9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ffddb8] text-[#2a1700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">monetization_on</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#767683] tracking-wider">
                हिमालयी रिवॉर्ड सिक्के
              </span>
              <p className="text-lg font-extrabold text-[#181c21]">{coinsBalance} सिक्के</p>
              <p className="text-[10px] text-[#1b6d24] font-semibold">अगली खरीदारी पर ₹{coinsBalance} की छूट</p>
            </div>
          </div>
          <button 
            onClick={() => alert(`आपके ₹${coinsBalance} के सिक्के लागू हो गए हैं!`)}
            className="bg-[#1b6d24] hover:bg-[#155a1d] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all"
          >
            भुनाएं
          </button>
        </div>

        {/* Mountain Impact Stats */}
        <div className="bg-gradient-to-r from-[#e0e0ff] to-[#f1f4fb] rounded-2xl p-4 border border-[#dfe2e9] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1a237e] text-[20px]">nature</span>
            <h3 className="text-xs font-bold text-[#181c21]">पहाड़ी समुदायों में आपका योगदान</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-white rounded-xl p-2 shadow-xs">
              <p className="text-base font-extrabold text-[#1a237e]">3</p>
              <p className="text-[9px] text-[#454652] font-medium leading-tight">किसान परिवार लाभान्वित</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-xs">
              <p className="text-base font-extrabold text-[#1b6d24]">100%</p>
              <p className="text-[9px] text-[#454652] font-medium leading-tight">शुद्ध हिमनदी जैविक</p>
            </div>
            <div className="bg-white rounded-xl p-2 shadow-xs">
              <p className="text-base font-extrabold text-[#d48700]">18.4 किग्रा</p>
              <p className="text-[9px] text-[#454652] font-medium leading-tight">कार्बन उत्सर्जन बचत</p>
            </div>
          </div>
        </div>

        {/* Settings & Addresses Menu */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#e5e8ef] overflow-hidden">
          
          <div 
            onClick={onOpenLocationModal}
            className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer border-b border-[#f1f4fb] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1a237e]">pin_drop</span>
              <div>
                <p className="text-xs font-bold text-[#181c21]">प्राथमिक डिलीवरी पता</p>
                <p className="text-[11px] text-[#767683]">{selectedCity}</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#767683] text-[20px]">chevron_right</span>
          </div>

          <div 
            onClick={handleCopyReferral}
            className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer border-b border-[#f1f4fb] transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1b6d24]">card_giftcard</span>
              <div>
                <p className="text-xs font-bold text-[#181c21]">दोस्त को जोड़ें और 200 सिक्के पाएं</p>
                <p className="text-[11px] text-[#767683]">कोड: <span className="font-bold text-[#1a237e]">HIMALAYA2026</span></p>
              </div>
            </div>
            <span className="text-[11px] text-[#1b6d24] font-bold">{copiedToast ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
          </div>

          <a 
            href="https://wa.me/?text=नमस्ते%20जेनिथ%20टीम!%20मुझे%20सहायता%20चाहिए।"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1b6d24]">support_agent</span>
              <div>
                <p className="text-xs font-bold text-[#181c21]">WhatsApp कस्टमर केयर सहायता</p>
                <p className="text-[11px] text-[#767683]">औसतन जवाब समय 2 मिनट से कम</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#767683] text-[20px]">chevron_right</span>
          </a>

        </div>

        <div className="text-center py-2 text-[10px] text-[#767683]">
          जेनिथ हिमालयन • संस्करण 2.5 • डिजिटल स्टूडियो व पहाड़ी जैविक भंडार
        </div>

      </div>
    </div>
  );
};

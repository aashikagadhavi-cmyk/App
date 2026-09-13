import React, { useState } from 'react';
import { LOGO_URL, USER_AVATAR_URL } from '../data/mockData';
import { AppTab } from '../types';

interface HeaderProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  selectedCity: string;
  onOpenLocationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  selectedCity,
  onOpenLocationModal
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const getSubTitle = () => {
    switch (currentTab) {
      case 'services':
        return 'डिजिटल स्टूडियो व सेवाएं';
      case 'naturals':
        return 'हिमालयी जैविक भंडार';
      case 'specialists':
        return 'तकनीशियन व विशेषज्ञ';
      case 'orders':
        return 'मेरे ऑर्डर व प्रूफ़';
      case 'admin':
        return 'एडमिन कंट्रोल पोर्टल';
      case 'profile':
        return 'मेरी प्रोफ़ाइल';
      default:
        return 'डिजिटल स्टूडियो';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#1a237e] text-white pt-safe shadow-[0_4px_14px_-2px_rgba(26,35,126,0.18)]">
      <div className="max-w-4xl mx-auto h-16 px-4 sm:px-5 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div 
          onClick={() => onTabChange('services')}
          className="flex items-center gap-2.5 cursor-pointer select-none active:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 p-1 flex items-center justify-center border border-white/20 shadow-xs">
            <img
              src={LOGO_URL}
              alt="Zenith Himalayan Logo"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8690ee] leading-none">
              जेनिथ हिमालयन
            </span>
            <h1 className="text-[17px] font-bold text-white leading-tight line-clamp-1">
              {getSubTitle()}
            </h1>
          </div>
        </div>

        {/* Center/Right quick action: Admin Portal Toggle */}
        <div className="flex items-center gap-2 relative">
          
          {/* Admin Portal Button in Header */}
          <button
            onClick={() => onTabChange(currentTab === 'admin' ? 'services' : 'admin')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all border ${
              currentTab === 'admin'
                ? 'bg-[#a3f69c] text-[#002204] border-[#a3f69c] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {currentTab === 'admin' ? 'home' : 'admin_panel_settings'}
            </span>
            <span className="hidden sm:inline">
              {currentTab === 'admin' ? 'यूज़र व्यू' : 'एडमिन पैनल'}
            </span>
          </button>

          {/* Location button */}
          <button
            onClick={onOpenLocationModal}
            className="hidden md:flex items-center gap-1 bg-white/10 hover:bg-white/15 text-white px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[15px] text-[#a3f69c]">location_on</span>
            <span className="truncate max-w-[90px]">{selectedCity}</span>
          </button>

          {/* Notifications button */}
          <button
            id="notifications-btn"
            aria-label="सूचनाएं"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/15 active:scale-95 transition-all relative"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#a3f69c] rounded-full ring-2 ring-[#1a237e] animate-pulse"></span>
          </button>

          {/* User Profile Avatar */}
          <button
            id="profile-btn"
            aria-label="प्रोफ़ाइल"
            onClick={() => onTabChange('profile')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#a3f69c] transition-all overflow-hidden p-0.5"
          >
            <img
              src={USER_AVATAR_URL}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/40"
            />
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute top-12 right-0 w-80 bg-white text-[#181c21] rounded-2xl shadow-[0_16px_40px_rgba(26,35,126,0.22)] border border-[#e5e8ef] p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#ebeef5]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a237e]">
                  ताज़ा सूचनाएं
                </span>
                <span className="text-[11px] bg-[#e0e0ff] text-[#000767] px-2 py-0.5 rounded-full font-semibold">
                  2 नई सूचना
                </span>
              </div>
              <div className="flex flex-col gap-2.5 pt-2.5">
                <div 
                  onClick={() => { setShowNotifications(false); onTabChange('orders'); }}
                  className="p-2 rounded-xl bg-[#f1f4fb] hover:bg-[#ebeef5] cursor-pointer transition-colors flex gap-2.5"
                >
                  <span className="material-symbols-outlined text-[#1b6d24] text-[20px] shrink-0 mt-0.5">
                    local_shipping
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#181c21]">ऑर्डर #ZH-8491 डिलीवरी पर निकला</p>
                    <p className="text-[11px] text-[#454652]">शुद्ध बद्री घी आज शाम 4:30 तक देहरादून पहुंचेगा।</p>
                  </div>
                </div>

                <div 
                  onClick={() => { setShowNotifications(false); onTabChange('orders'); }}
                  className="p-2 rounded-xl bg-[#f1f4fb] hover:bg-[#ebeef5] cursor-pointer transition-colors flex gap-2.5"
                >
                  <span className="material-symbols-outlined text-[#1a237e] text-[20px] shrink-0 mt-0.5">
                    verified
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#181c21]">दीपावली पोस्टर प्रूफ़ तैयार</p>
                    <p className="text-[11px] text-[#454652]">डिज़ाइनर द्वारा WhatsApp पर भेजा गया। जांचें।</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full text-center text-xs font-bold text-[#1a237e] pt-2 mt-1 hover:underline block"
              >
                बंद करें
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { AppTab } from '../types';

interface BottomNavProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  cartCount
}) => {
  const handleCenterAction = () => {
    if (currentTab === 'services') {
      onTabChange('naturals');
    } else {
      onTabChange('services');
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe px-3 sm:px-6 pointer-events-none">
      <div className="max-w-lg mx-auto pointer-events-auto relative mb-3 bg-white/95 backdrop-blur-md rounded-full px-3 shadow-[0_12px_36px_rgba(26,35,126,0.18)] border border-[#dfe2e9]/70 flex items-center justify-between h-16">
        
        {/* Services Tab */}
        <button
          id="nav-services-btn"
          aria-label="सेवाएं"
          onClick={() => onTabChange('services')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-all ${
            currentTab === 'services'
              ? 'text-[#1a237e] font-bold scale-105'
              : 'text-[#454652] hover:text-[#181c21]'
          }`}
        >
          <span 
            className={`material-symbols-outlined text-[22px] ${
              currentTab === 'services' ? 'material-symbols-filled' : ''
            }`}
          >
            palette
          </span>
          <span className="text-[10px] font-semibold mt-0.5">सेवाएं</span>
        </button>

        {/* Naturals Tab */}
        <button
          id="nav-naturals-btn"
          aria-label="पहाड़ी उत्पाद"
          onClick={() => onTabChange('naturals')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-all relative ${
            currentTab === 'naturals'
              ? 'text-[#1b6d24] font-bold scale-105'
              : 'text-[#454652] hover:text-[#181c21]'
          }`}
        >
          <span 
            className={`material-symbols-outlined text-[22px] ${
              currentTab === 'naturals' ? 'material-symbols-filled' : ''
            }`}
          >
            eco
          </span>
          <span className="text-[10px] font-semibold mt-0.5">जैविक</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#1b6d24] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          )}
        </button>

        {/* Center Elevated Floating Action Button (FAB) */}
        <div className="relative -top-5 flex justify-center items-center">
          <button
            id="nav-fab-switch-btn"
            aria-label="मोड बदलें"
            onClick={handleCenterAction}
            title={currentTab === 'services' ? "पहाड़ी जैविक भंडार पर जाएं" : "डिजिटल स्टूडियो पर जाएं"}
            className={`w-13 h-13 rounded-full text-white shadow-[0_8px_24px_rgba(27,109,36,0.38)] active:scale-95 transition-all flex items-center justify-center ${
              currentTab === 'naturals' 
                ? 'bg-[#1a237e] ring-4 ring-white shadow-[0_8px_24px_rgba(26,35,126,0.38)]' 
                : 'bg-[#1b6d24] ring-4 ring-white'
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">
              swap_horiz
            </span>
          </button>
        </div>

        {/* Orders Tab */}
        <button
          id="nav-orders-btn"
          aria-label="मेरे ऑर्डर"
          onClick={() => onTabChange('orders')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-all ${
            currentTab === 'orders'
              ? 'text-[#1a237e] font-bold scale-105'
              : 'text-[#454652] hover:text-[#181c21]'
          }`}
        >
          <span 
            className={`material-symbols-outlined text-[22px] ${
              currentTab === 'orders' ? 'material-symbols-filled' : ''
            }`}
          >
            receipt_long
          </span>
          <span className="text-[10px] font-semibold mt-0.5">ऑर्डर्स</span>
        </button>

        {/* Admin Portal Tab */}
        <button
          id="nav-admin-btn"
          aria-label="एडमिन पैनल"
          onClick={() => onTabChange('admin')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-all ${
            currentTab === 'admin'
              ? 'text-[#1a237e] font-bold scale-105'
              : 'text-[#454652] hover:text-[#181c21]'
          }`}
        >
          <span 
            className={`material-symbols-outlined text-[22px] ${
              currentTab === 'admin' ? 'material-symbols-filled text-[#1a237e]' : ''
            }`}
          >
            database
          </span>
          <span className="text-[10px] font-semibold mt-0.5">एडमिन</span>
        </button>

      </div>
    </nav>
  );
};

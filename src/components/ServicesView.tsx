import React, { useState } from 'react';
import { CREATIVE_SERVICES, SHOWCASE_BANNER_URL } from '../data/mockData';
import { ServiceItem, AppTab } from '../types';

interface ServicesViewProps {
  onSelectService: (service: ServiceItem) => void;
  onOpenQuoteModal: () => void;
  onOpenFilterModal: () => void;
  onTabChange: (tab: AppTab) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onSelectService,
  onOpenQuoteModal,
  onOpenFilterModal,
  onTabChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const quickTags = [
    { id: 'all', label: 'सभी सेवाएं', icon: 'grid_view' },
    { id: 'poster', label: 'पोस्टर व बैनर', icon: 'palette' },
    { id: 'express', label: 'एक्सप्रेस (4 घंटे)', icon: 'bolt' },
    { id: 'festivals', label: 'त्यौहार ऑफ़र', icon: 'celebration' },
    { id: 'reels', label: 'वीडियो व रील्स', icon: 'play_circle' },
    { id: 'resumes', label: 'रिज्यूमे / बायोडाटा', icon: 'badge' }
  ];

  const filteredServices = CREATIVE_SERVICES.filter(service => {
    const matchesSearch = service.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTag === 'express') return service.deliveryTime.includes('4');
    if (activeTag === 'poster') return service.id.includes('poster');
    if (activeTag === 'festivals') return service.id.includes('poster');
    if (activeTag === 'resumes') return service.id.includes('resume');
    if (activeTag === 'reels') return service.id.includes('video');
    return true;
  });

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Royal Blue Header Canvas with Inverted Curved Bottom */}
      <div className="bg-[#1a237e] px-4 sm:px-5 pt-3 pb-8 text-white rounded-b-[28px] shadow-[0_12px_28px_-4px_rgba(26,35,126,0.25)] relative z-10">
        <div className="max-w-md mx-auto">
          {/* Top Greeting & Segmented Switcher */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#a3f69c] animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#8690ee] tracking-wider uppercase">
                  जेनिथ डिजिटल स्टूडियो
                </span>
              </div>
              <p className="text-[18px] text-white font-bold mt-0.5 tracking-tight">
                आकर्षक पोस्टर व डिज़ाइन
              </p>
            </div>

            {/* Segmented Dual Switcher Pill */}
            <div className="flex items-center bg-white/15 p-1 rounded-full backdrop-blur-md border border-white/15">
              <button 
                className="px-3 py-1.5 rounded-full bg-white text-[#1a237e] text-xs font-bold shadow-sm transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">palette</span>
                <span>स्टूडियो</span>
              </button>
              <button 
                onClick={() => onTabChange('naturals')}
                className="px-3 py-1.5 rounded-full text-white/90 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">eco</span>
                <span>जैविक</span>
              </button>
            </div>
          </div>

          {/* Live Search Input Pill */}
          <div className="relative mt-2">
            <div className="flex items-center bg-white text-[#181c21] rounded-full shadow-[0_8px_20px_rgba(0,6,102,0.12)] px-4 py-2.5 gap-2.5">
              <span className="material-symbols-outlined text-[#767683] text-[22px]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="पोस्टर, दुकान का बैनर, रील्स, पत्र खोजें..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#181c21] placeholder:text-[#767683] focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[#767683] hover:text-[#181c21] p-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <button
                id="services-filter-btn"
                aria-label="फ़िल्टर"
                onClick={onOpenFilterModal}
                className="w-8 h-8 rounded-full bg-[#f1f4fb] hover:bg-[#e0e0ff] flex items-center justify-center text-[#1a237e] transition-all active:scale-90 shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>
          </div>

          {/* Quick Tags Scrolling Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 -mx-4 px-4 sm:-mx-5 sm:px-5">
            {quickTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTag === tag.id
                    ? 'bg-white text-[#1a237e] shadow-sm font-bold scale-102'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Space */}
      <div className="max-w-md mx-auto w-full px-4 sm:px-5 pt-5 flex flex-col gap-5">
        
        {/* Section Title & Verified Badge */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#181c21] tracking-tight">
              रचनात्मक सेवाएं व पोस्टर
            </h2>
            <p className="text-xs text-[#454652]">तुरंत 4 घंटे में डिलीवरी • असीमित संशोधन</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#a3f69c] text-[#002204] text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <span className="material-symbols-outlined text-[14px]">verified</span> सत्यापित प्रो
          </span>
        </div>

        {/* Reference Grid of 6 Soft Tactile Square Service Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-white rounded-2xl p-4 flex flex-col justify-between shadow-[0_4px_14px_-2px_rgba(26,35,126,0.07)] border border-[#e5e8ef]/80 hover:border-[#1a237e] active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
            >
              {/* Soft decorative background bubble */}
              <div 
                className={`absolute -right-3 -top-3 w-16 h-16 rounded-full ${service.bgColor} opacity-60 transition-transform group-hover:scale-125`}
              />
              
              {/* Icon Container */}
              <div className={`w-11 h-11 rounded-xl ${service.bgColor} flex items-center justify-center ${service.iconColor} mb-2.5 shadow-xs relative z-10`}>
                <span className="material-symbols-outlined text-[24px]">{service.icon}</span>
              </div>

              {/* Title & Description */}
              <div className="relative z-10">
                <span className="text-[10px] text-[#8690ee] font-bold block mb-0.5">
                  {service.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#181c21] leading-snug mb-1 group-hover:text-[#1a237e] transition-colors">
                  {service.titleHi}
                </h3>
                <p className="text-[11px] text-[#454652] line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="mt-3 pt-2 flex items-center justify-between border-t border-[#f1f4fb] relative z-10">
                <span className="text-[10px] font-medium text-[#767683]">शुरुआती मूल्य</span>
                <span className="text-sm font-extrabold text-[#1a237e]">
                  ₹{service.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cross-Promotion Highlight Banner to Himalayan Naturals Store */}
        <div 
          onClick={() => onTabChange('naturals')}
          className="bg-[#1b6d24] text-white rounded-2xl p-4 shadow-[0_8px_24px_rgba(27,109,36,0.22)] flex items-center justify-between gap-3 relative overflow-hidden cursor-pointer hover:bg-[#155a1d] transition-colors"
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-[#a3f69c] text-[#002204] flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">filter_vintage</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white leading-tight">
                  हिमालयी जैविक भंडार
                </h4>
                <span className="text-[13px]">🏔️</span>
              </div>
              <p className="text-xs text-white/90 mt-0.5 truncate">
                शुद्ध बद्री गाय घी, जंगली शहद व पहाड़ी राजमा
              </p>
            </div>
          </div>
          <button 
            className="shrink-0 bg-white text-[#1b6d24] px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1"
          >
            <span>देखें</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>

        {/* Recent Deliveries & Proofs Showcase Card */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_14px_-2px_rgba(26,35,126,0.06)] border border-[#e5e8ef]/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1a237e] text-[20px]">
                workspace_premium
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#181c21]">
                हाल ही में डिलीवर किए गए पोस्टर प्रूफ़
              </h3>
            </div>
            <div className="flex items-center gap-1 bg-[#f1f4fb] px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[#F59E0B] text-[14px] material-symbols-filled">
                star
              </span>
              <span className="text-xs text-[#181c21] font-bold">4.9/5</span>
              <span className="text-[10px] text-[#767683]">(1,240+)</span>
            </div>
          </div>

          {/* Express Guarantee & Showcase Image Preview */}
          <div className="flex gap-3 items-center bg-[#f1f4fb] p-2.5 rounded-xl mb-3">
            <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 shadow-xs border border-white">
              <img
                src={SHOWCASE_BANNER_URL}
                alt="Zenith Showcase"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between py-0.5">
              <div>
                <span className="text-[10px] text-[#1b6d24] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">timer</span>
                  एक्सप्रेस 4 घंटे गारंटी
                </span>
                <p className="text-xs text-[#181c21] font-bold mt-0.5">
                  दीपावली महोत्सव ऑफ़र पोस्टर
                </p>
                <p className="text-[11px] text-[#454652]">
                  शर्मा स्वीट्स, राजपुर रोड देहरादून हेतु डिलीवर
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[10px] bg-[#dfe2e9] text-[#454652] px-2 py-0.5 rounded font-medium">
                  संशोधन: 0
                </span>
                <span className="text-[10px] bg-[#a3f69c] text-[#002204] px-2 py-0.5 rounded font-bold">
                  100% समय पर
                </span>
              </div>
            </div>
          </div>

          {/* Safe Escrow & View Gallery link */}
          <div className="flex items-center justify-between text-xs text-[#454652] pt-1 border-t border-[#f1f4fb]">
            <span className="flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-[#1b6d24]">verified_user</span>
              100% सुरक्षित भुगतान व संतुष्टि
            </span>
            <button 
              onClick={() => setShowGalleryModal(true)}
              className="text-xs text-[#1a237e] font-bold flex items-center hover:underline"
            >
              गैलरी देखें
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Action Button: Book Poster / Quote */}
        <div className="flex flex-col gap-2.5">
          <button
            id="request-quote-btn"
            onClick={onOpenQuoteModal}
            className="w-full bg-[#1a237e] hover:bg-[#000666] text-white py-3.5 px-5 rounded-full text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(26,35,126,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[19px]">add_task</span>
            <span>नया पोस्टर ऑर्डर करें (विवरण भरें)</span>
          </button>

          <a
            href="https://wa.me/?text=नमस्ते%20जेनिथ%20हिमालयन!%20मुझे%20एक%20पोस्टर%20डिज़ाइन%20करवाना%20है।"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-[#f1f4fb] text-[#1b6d24] py-3 px-5 rounded-full text-xs font-bold shadow-xs border border-[#dfe2e9] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[19px] text-[#1b6d24]">chat</span>
            <span>WhatsApp पर तुरंत सहायता (औसतन जवाब &lt; 2 मिनट)</span>
          </a>
        </div>

      </div>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfe2e9]">
              <h3 className="text-base font-bold text-[#181c21]">डिलीवर किए गए पोस्टर प्रूफ़</h3>
              <button 
                onClick={() => setShowGalleryModal(false)}
                className="w-8 h-8 rounded-full bg-[#f1f4fb] flex items-center justify-center text-[#454652]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="py-3 flex flex-col gap-3">
              <img 
                src={SHOWCASE_BANNER_URL} 
                alt="Creative Showcase" 
                className="w-full rounded-xl shadow-xs"
              />
              <p className="text-xs text-[#454652] leading-relaxed">
                दुकान प्रचार, दीपावली, होली, राजनीतिक बैनर और सोशल मीडिया पोस्ट्स के नवीनतम और सत्यापित डिज़ाइन।
              </p>
              <div className="bg-[#f1f4fb] p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="font-semibold text-[#181c21]">औसत रेटिंग</span>
                <span className="font-bold text-[#1b6d24]">⭐ 4.9 / 5 (1,240+ संतुष्ट ग्राहक)</span>
              </div>
            </div>
            <button
              onClick={() => setShowGalleryModal(false)}
              className="w-full bg-[#1a237e] text-white py-2.5 rounded-full text-xs font-bold mt-2"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

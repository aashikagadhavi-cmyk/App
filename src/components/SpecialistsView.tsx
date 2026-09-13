import React, { useState } from 'react';
import { FIELD_SPECIALISTS } from '../data/mockData';
import { Specialist } from '../types';

interface SpecialistsViewProps {
  onBookSpecialist: (specialist: Specialist) => void;
}

export const SpecialistsView: React.FC<SpecialistsViewProps> = ({ onBookSpecialist }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredSpecialists = FIELD_SPECIALISTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBook = (specialist: Specialist) => {
    onBookSpecialist(specialist);
    setBookingSuccess(specialist.name);
    setTimeout(() => setBookingSuccess(null), 3500);
  };

  return (
    <div className="flex flex-col w-full pb-24">
      {/* Top Banner */}
      <div className="bg-[#1a237e] text-white px-4 sm:px-5 pt-3 pb-6 rounded-b-[28px] shadow-[0_12px_28px_rgba(26,35,126,0.25)]">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#2e7d32] text-white px-3.5 py-1.5 rounded-full shadow-md text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">near_me</span>
              <span>नज़दीकी फ़ील्ड विशेषज्ञ</span>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-xs">+</span>
            </div>

            <div className="flex items-center bg-white/15 p-1 rounded-full text-xs font-semibold">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'list' ? 'bg-white text-[#1a237e] font-bold shadow-xs' : 'text-white'
                }`}
              >
                सूची
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeTab === 'map' ? 'bg-white text-[#1a237e] font-bold shadow-xs' : 'text-white'
                }`}
              >
                मैप रडार
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center bg-white text-[#181c21] rounded-full px-4 py-2.5 shadow-xs">
              <span className="material-symbols-outlined text-[#767683] text-[20px] mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="मैकेनिक, लेथ मशीन, सोलर, इलेक्ट्रीशियन खोजें..."
                className="bg-transparent border-none outline-none w-full text-xs text-[#181c21] placeholder:text-[#767683]"
              />
              <span className="material-symbols-outlined text-[#1a237e] text-[20px]">tune</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 sm:px-5 mt-4 flex flex-col gap-4">
        
        {/* Success Alert Banner */}
        {bookingSuccess && (
          <div className="bg-[#a3f69c] text-[#002204] p-3 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{bookingSuccess} को सेवा का अनुरोध भेजा गया! वे 35 मिनट के भीतर पहुंचेंगे।</span>
          </div>
        )}

        {/* Map View Toggle */}
        {activeTab === 'map' && (
          <div className="relative w-full h-72 rounded-3xl overflow-hidden shadow-xs border border-[#dfe2e9] bg-[#eef1f8]">
            <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#eef2f9" />
              <path d="M-20,40 Q120,60 200,140 T400,200" fill="none" stroke="#ffffff" strokeWidth="18" />
              <path d="M50,-20 Q120,100 160,300" fill="none" stroke="#ffffff" strokeWidth="14" />
              <path d="M220,0 L200,320" fill="none" stroke="#ffffff" strokeWidth="22" />
              <path d="M0,180 Q200,120 400,240" fill="none" stroke="#ffffff" strokeWidth="16" />
              <circle cx="200" cy="140" r="70" fill="#1a237e" fillOpacity="0.08" />
              <circle cx="200" cy="140" r="35" fill="#1a237e" fillOpacity="0.15" />
            </svg>

            {/* User Center Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-[#1a237e] text-white flex items-center justify-center ring-4 ring-white shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a0f399] animate-ping"></span>
              </div>
              <span className="bg-[#1a237e] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-xs">
                आपका स्थान
              </span>
            </div>

            {/* Specialist Pins */}
            <div 
              onClick={() => setSelectedSpecialist(FIELD_SPECIALISTS[0])}
              className="absolute top-14 left-1/4 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md ring-2 ring-[#F59E0B] group-hover:scale-110 transition-transform">
                <img src={FIELD_SPECIALISTS[0].avatarUrl} alt="Henry" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="bg-white text-[#181c21] text-[10px] font-bold px-1.5 py-0.2 rounded shadow-xs mt-0.5">
                हेनरी (₹450/घंटा)
              </span>
            </div>

            <div 
              onClick={() => setSelectedSpecialist(FIELD_SPECIALISTS[1])}
              className="absolute bottom-16 right-1/4 translate-x-1/2 flex flex-col items-center cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-white p-0.5 shadow-md ring-2 ring-[#1b6d24] group-hover:scale-110 transition-transform">
                <img src={FIELD_SPECIALISTS[1].avatarUrl} alt="Michael" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="bg-white text-[#181c21] text-[10px] font-bold px-1.5 py-0.2 rounded shadow-xs mt-0.5">
                माइकल (₹550/घंटा)
              </span>
            </div>
          </div>
        )}

        {/* Specialists List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#181c21]">उपलब्ध तकनीशियन व विशेषज्ञ</h3>
            <span className="text-xs text-[#767683]">{filteredSpecialists.length} नज़दीक उपलब्ध</span>
          </div>

          {filteredSpecialists.map((specialist) => (
            <div
              key={specialist.id}
              className="bg-white rounded-2xl p-3.5 shadow-xs border border-[#e5e8ef] flex items-center justify-between gap-3 hover:border-[#1a237e]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#e5e8ef]">
                  <img src={specialist.avatarUrl} alt={specialist.name} className="w-full h-full object-cover" />
                  {specialist.isTopRated && (
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#F59E0B] rounded-full flex items-center justify-center text-[10px] text-white shadow-xs">
                      ★
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-[#181c21]">{specialist.name}</h4>
                    {specialist.isTopRated && (
                      <span className="material-symbols-outlined text-[#F59E0B] text-[16px] material-symbols-filled">
                        verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#454652]">{specialist.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-[#1a237e]">₹{specialist.hourlyRate * 10}/घंटा</span>
                    <span className="text-[10px] text-[#767683]">• {specialist.distance}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  specialist.status === 'Available Now' ? 'bg-[#a3f69c] text-[#002204]' : 'bg-[#e5e8ef] text-[#454652]'
                }`}>
                  उपलब्ध
                </span>
                <button
                  onClick={() => handleBook(specialist)}
                  className="bg-[#1a237e] hover:bg-[#000666] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all"
                >
                  बुक करें
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

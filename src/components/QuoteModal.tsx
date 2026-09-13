import React, { useState } from 'react';
import { CREATIVE_SERVICES } from '../data/mockData';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote: (quoteDetails: {
    serviceName: string;
    speed: string;
    total: number;
    brief: string;
  }) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuote
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState(CREATIVE_SERVICES[0].id);
  const [speed, setSpeed] = useState<'standard' | 'express' | 'lightning'>('express');
  const [briefText, setBriefText] = useState('');
  const [needSourceFiles, setNeedSourceFiles] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentService = CREATIVE_SERVICES.find(s => s.id === selectedServiceId) || CREATIVE_SERVICES[0];

  const speedFee = speed === 'standard' ? 0 : speed === 'express' ? 120 : 250;
  const sourceFee = needSourceFiles ? 99 : 0;
  const calculatedTotal = currentService.price + speedFee + sourceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitQuote({
        serviceName: currentService.title,
        speed: speed === 'express' ? 'Express 4h' : speed === 'lightning' ? 'Lightning 2h' : 'Standard 24h',
        total: calculatedTotal,
        brief: briefText || 'Standard initial brief'
      });
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Zenith Himalayan! I'd like to request a quote for ${currentService.title}. Speed: ${speed}, Budget: ₹${calculatedTotal}. Brief: ${briefText}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dfe2e9] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#1a237e] text-white p-4 sm:p-5 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">post_add</span>
            <div>
              <h3 className="text-base font-bold">Custom Creative Quote</h3>
              <p className="text-[11px] text-[#8690ee]">Instant Estimate • Verified Pro Turnaround</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-4">
          
          {/* Select Service */}
          <div>
            <label className="text-xs font-bold text-[#181c21] block mb-1.5">
              Select Desired Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-[#f1f4fb] border border-[#dfe2e9] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#181c21] focus:outline-none focus:border-[#1a237e]"
            >
              {CREATIVE_SERVICES.map(s => (
                <option key={s.id} value={s.id}>
                  {s.title} (Base ₹{s.price})
                </option>
              ))}
            </select>
          </div>

          {/* Turnaround Speed */}
          <div>
            <label className="text-xs font-bold text-[#181c21] block mb-1.5">
              Turnaround Speed
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSpeed('standard')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  speed === 'standard'
                    ? 'bg-[#e0e0ff] border-[#1a237e] text-[#1a237e]'
                    : 'bg-white border-[#dfe2e9] text-[#454652]'
                }`}
              >
                <div className="text-[11px] font-bold">Standard</div>
                <div className="text-[10px] text-[#767683]">24 Hours</div>
                <div className="text-[10px] font-semibold mt-0.5">+₹0</div>
              </button>

              <button
                type="button"
                onClick={() => setSpeed('express')}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  speed === 'express'
                    ? 'bg-[#a3f69c]/40 border-[#1b6d24] text-[#002204]'
                    : 'bg-white border-[#dfe2e9] text-[#454652]'
                }`}
              >
                <span className="absolute -top-1.5 right-1 bg-[#1b6d24] text-white text-[8px] font-bold px-1.5 rounded-full">
                  POPULAR
                </span>
                <div className="text-[11px] font-bold">Express</div>
                <div className="text-[10px] text-[#767683]">4 Hours</div>
                <div className="text-[10px] font-semibold mt-0.5 text-[#1b6d24]">+₹120</div>
              </button>

              <button
                type="button"
                onClick={() => setSpeed('lightning')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  speed === 'lightning'
                    ? 'bg-[#ffddb8] border-[#d48700] text-[#2a1700]'
                    : 'bg-white border-[#dfe2e9] text-[#454652]'
                }`}
              >
                <div className="text-[11px] font-bold">Lightning</div>
                <div className="text-[10px] text-[#767683]">2 Hours</div>
                <div className="text-[10px] font-semibold mt-0.5 text-[#d48700]">+₹250</div>
              </button>
            </div>
          </div>

          {/* Source files checkbox */}
          <div className="bg-[#f7f9ff] p-3 rounded-xl border border-[#dfe2e9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sourceFilesCheck"
                checked={needSourceFiles}
                onChange={(e) => setNeedSourceFiles(e.target.checked)}
                className="w-4 h-4 text-[#1a237e] rounded"
              />
              <label htmlFor="sourceFilesCheck" className="text-xs font-semibold text-[#181c21] cursor-pointer">
                Include Editable Vector &amp; Canva Source Files
              </label>
            </div>
            <span className="text-xs font-bold text-[#1a237e]">+₹99</span>
          </div>

          {/* Project Brief / Notes */}
          <div>
            <label className="text-xs font-bold text-[#181c21] block mb-1.5">
              Project Details or Reference Links
            </label>
            <textarea
              rows={3}
              value={briefText}
              onChange={(e) => setBriefText(e.target.value)}
              placeholder="e.g. Need festive social posters with Diwali offer text for Sharma Sweets Dehradun..."
              className="w-full bg-white border border-[#dfe2e9] rounded-xl p-2.5 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
            />
          </div>

          {/* Live Price Calculation summary */}
          <div className="bg-[#f1f4fb] p-3 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#767683]">Calculated Quote</span>
              <p className="text-lg font-extrabold text-[#1a237e]">₹{calculatedTotal}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-[#a3f69c] text-[#002204] font-bold px-2 py-0.5 rounded-full">
                Escrow Protected
              </span>
              <p className="text-[10px] text-[#767683] mt-0.5">Unlimited Revisions Included</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full bg-[#1a237e] hover:bg-[#000666] text-white py-3 px-4 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              {isSubmitted ? (
                <span>Generating Digital Contract...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  <span>Confirm Booking • ₹{calculatedTotal}</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-[#1b6d24] text-[#1b6d24] py-2.5 px-4 rounded-full text-xs font-bold text-center hover:bg-[#a3f69c]/15 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Send Direct to WhatsApp Specialist</span>
            </a>
          </div>

        </form>
      </div>
    </div>
  );
};

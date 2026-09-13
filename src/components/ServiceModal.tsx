import React from 'react';
import { ServiceItem } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (service: ServiceItem) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onBookService
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dfe2e9] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#1a237e] text-white p-5 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[28px]">{service.icon}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8690ee] tracking-wider">
                {service.category}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{service.titleHi}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="bg-[#a3f69c] text-[#002204] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {service.deliveryTime}
            </span>
            <span className="bg-white/15 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {service.revisions}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h4 className="text-xs font-bold text-[#181c21] uppercase tracking-wider mb-1">विवरण</h4>
            <p className="text-xs text-[#454652] leading-relaxed">{service.description}</p>
          </div>

          {/* Included Deliverables */}
          <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9]">
            <h4 className="text-xs font-bold text-[#181c21] mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#1a237e] text-[18px]">verified</span>
              <span>पैकेज में क्या-क्या मिलेगा</span>
            </h4>
            <div className="flex flex-col gap-1.5">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#181c21]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24]"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Guarantee */}
          <div className="flex items-center justify-between p-3 bg-[#f1f4fb] rounded-2xl">
            <div>
              <span className="text-[10px] text-[#767683] font-bold uppercase">शुरुआती मूल्य</span>
              <p className="text-xl font-extrabold text-[#1a237e]">₹{service.price}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#1b6d24]">100% समय पर डिलीवरी</span>
              <p className="text-[10px] text-[#767683]">संतुष्टि की पूरी गारंटी</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1 border-t border-[#f1f4fb]">
            <button
              onClick={() => {
                onBookService(service);
                onClose();
              }}
              className="w-full bg-[#1a237e] hover:bg-[#000666] text-white py-3 px-4 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">edit_document</span>
              <span>पोस्टर विवरण भरें और ऑर्डर करें (फ़ोटो, आवाज़, नाम)</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`नमस्ते जेनिथ स्टूडियो! मुझे ${service.titleHi} का ऑर्डर करना है।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white border border-[#1b6d24] text-[#1b6d24] py-2.5 px-4 rounded-full text-xs font-bold text-center hover:bg-[#a3f69c]/15 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>WhatsApp पर सीधे बात करें</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

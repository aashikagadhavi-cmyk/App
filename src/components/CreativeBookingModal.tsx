import React, { useState, useEffect } from 'react';
import { ServiceItem } from '../types';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { CREATIVE_SERVICES, CITIES_LIST } from '../data/mockData';

interface CreativeBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  selectedCity: string;
  onOrderCreated: (newOrder: any) => void;
}

export const CreativeBookingModal: React.FC<CreativeBookingModalProps> = ({
  isOpen,
  onClose,
  service,
  selectedCity,
  onOrderCreated
}) => {
  const currentService = service || CREATIVE_SERVICES[0];

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [city, setCity] = useState(selectedCity || 'देहरादून');
  const [posterCategory, setPosterCategory] = useState('त्यौहार / पर्व ग्रीटिंग व सेल');
  const [posterSize, setPosterSize] = useState('1:1 स्क्वायर (Instagram / WhatsApp पोस्ट)');
  const [languagePreference, setLanguagePreference] = useState('हिंदी व अंग्रेज़ी मिक्स');
  const [requirementsText, setRequirementsText] = useState('');
  const [voiceNoteAudioUrl, setVoiceNoteAudioUrl] = useState<string | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<number>(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [speed, setSpeed] = useState<'standard' | 'express' | 'lightning'>('express');
  const [includeSourceFiles, setIncludeSourceFiles] = useState(true);

  // Status & Error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSuccessOrder(null);
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Pricing calculations
  const basePrice = currentService.price;
  const speedFee = speed === 'standard' ? 0 : speed === 'express' ? 120 : 250;
  const sourceFee = includeSourceFiles ? 99 : 0;
  const grandTotal = basePrice + speedFee + sourceFee;

  // Handle image upload & convert to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (uploadedImages.length >= 4) {
        setValidationError('अधिकतम 4 तस्वीरें ही अपलोड की जा सकती हैं।');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadedImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit Order to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form Validations
    if (!customerName.trim()) {
      setValidationError('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setValidationError('कृपया सही 10 अंकों का WhatsApp मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!requirementsText.trim() && !voiceNoteAudioUrl) {
      setValidationError('कृपया पोस्टर का विवरण लिखें या माइक से वॉइस नोट रिकॉर्ड करें ताकि डिज़ाइनर समझ सके।');
      return;
    }

    setIsSubmitting(true);

    const speedLabel =
      speed === 'express'
        ? 'एक्सप्रेस (4 घंटे)'
        : speed === 'lightning'
        ? 'सुपरफास्ट (2 घंटे)'
        : 'स्टैंडर्ड (24 घंटे)';

    const orderPayload = {
      type: 'creative',
      title: `${currentService.titleHi} (${posterCategory})`,
      customerName: customerName.trim(),
      whatsappNumber: cleanPhone,
      city,
      posterCategory,
      posterSize,
      languagePreference,
      requirementsText: requirementsText.trim(),
      voiceNoteAudioUrl,
      voiceNoteDuration,
      uploadedImages,
      turnaroundSpeed: speedLabel,
      includeSourceFiles,
      total: grandTotal,
      itemsCount: 1,
      deliveryAddress: `WhatsApp नंबर ${cleanPhone} पर डिजिटल डिलीवरी`,
      eta: speed === 'express' ? '4 घंटे के भीतर डिलीवरी' : speed === 'lightning' ? '2 घंटे में सुपरफास्ट' : '24 घंटे में'
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      if (data.success && data.order) {
        setSuccessOrder(data.order);
        onOrderCreated(data.order);
      } else {
        throw new Error(data.message || 'ऑर्डर दर्ज करने में समस्या हुई।');
      }
    } catch (err: any) {
      console.error('Error submitting order:', err);
      // Fallback local order creation if offline
      const fallbackOrder = {
        ...orderPayload,
        id: `ord-${Date.now()}`,
        orderNumber: `ZH-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'आज, ' + new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        status: 'नया ऑर्डर',
        imageThumbnail: uploadedImages[0] || currentService.icon
      };
      setSuccessOrder(fallbackOrder);
      onOrderCreated(fallbackOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#dfe2e9] my-auto animate-in zoom-in-95 flex flex-col">
        
        {/* Modal Top Header */}
        <div className="bg-[#1a237e] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">palette</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-snug">
                पोस्टर व डिज़ाइन ऑर्डर फ़ॉर्म
              </h3>
              <p className="text-[11px] text-[#8690ee]">
                {currentService.titleHi} • विवरण दर्ज करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Successful Confirmation Screen */}
        {successOrder ? (
          <div className="p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-[#a3f69c] text-[#002204] flex items-center justify-center mb-3 shadow-lg ring-8 ring-[#a3f69c]/20">
              <span className="material-symbols-outlined text-[36px] font-bold">check</span>
            </div>
            <h3 className="text-lg font-bold text-[#181c21]">
              ऑर्डर सफलतापूर्वक दर्ज हो गया!
            </h3>
            <span className="text-xs font-bold text-[#1a237e] bg-[#e0e0ff] px-3 py-1 rounded-full mt-1.5">
              ऑर्डर संख्या: #{successOrder.orderNumber}
            </span>

            <div className="bg-[#f7f9ff] p-4 rounded-2xl border border-[#dfe2e9] w-full text-left my-4 flex flex-col gap-2 text-xs">
              <div className="flex justify-between border-b border-[#e5e8ef] pb-1.5">
                <span className="text-[#767683]">ग्राहक का नाम:</span>
                <span className="font-bold text-[#181c21]">{successOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e8ef] pb-1.5">
                <span className="text-[#767683]">WhatsApp नंबर:</span>
                <span className="font-bold text-[#1a237e]">+91 {successOrder.whatsappNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e8ef] pb-1.5">
                <span className="text-[#767683]">पोस्टर श्रेणी:</span>
                <span className="font-semibold text-[#181c21]">{successOrder.posterCategory}</span>
              </div>
              <div className="flex justify-between border-b border-[#e5e8ef] pb-1.5">
                <span className="text-[#767683]">डिलीवरी समय:</span>
                <span className="font-bold text-[#1b6d24]">{successOrder.eta}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-[#767683]">कुल देय राशि:</span>
                <span className="font-extrabold text-base text-[#1a237e]">₹{successOrder.total}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#454652] max-w-sm mb-4 leading-relaxed">
              आपका ऑर्डर सीधे हमारे डिज़ाइनर के पास पहुँच चुका है। डिज़ाइनर आपसे आपके WhatsApp नंबर पर संपर्क करके पहला प्रूफ़ साझा करेगा।
            </p>

            <div className="w-full flex flex-col gap-2">
              <a
                href={`https://wa.me/91${successOrder.whatsappNumber}?text=${encodeURIComponent(
                  `नमस्ते! मैंने Zenith Studio पर पोस्टर ऑर्डर #${successOrder.orderNumber} दिया है। कुल राशि ₹${successOrder.total}।`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#1b6d24] hover:bg-[#155a1d] text-white py-3 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>WhatsApp पर तुरंत चैट करें</span>
              </a>

              <button
                onClick={onClose}
                className="w-full bg-[#f1f4fb] hover:bg-[#e0e0ff] text-[#1a237e] py-2.5 rounded-full text-xs font-bold transition-colors"
              >
                बंद करें
              </button>
            </div>
          </div>
        ) : (
          /* Detailed Booking Form */
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-4">
            
            {/* Validation alert if any */}
            {validationError && (
              <div className="bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* STEP 1: Customer Contact Details */}
            <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-[#e5e8ef] pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[11px] font-bold">1</span>
                <h4 className="text-xs font-bold text-[#181c21]">आपकी जानकारी (ग्राहक विवरण)</h4>
              </div>

              {/* Name */}
              <div>
                <label className="text-[11px] font-bold text-[#454652] block mb-1">
                  आपका पूरा नाम <span className="text-[#ba1a1a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="उदा. राजेश शर्मा / शर्मा किराना स्टोर"
                  className="w-full bg-white border border-[#dfe2e9] rounded-xl px-3 py-2 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                />
              </div>

              {/* WhatsApp Phone Number */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-[#454652]">
                    WhatsApp मोबाइल नंबर <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <span className="text-[10px] text-[#1b6d24] font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">chat</span>
                    प्रूफ़ व फ़ाइनल पोस्टर इसी पर आएगा
                  </span>
                </div>
                <div className="flex items-center bg-white border border-[#dfe2e9] rounded-xl overflow-hidden focus-within:border-[#1a237e]">
                  <span className="bg-[#f1f4fb] px-2.5 py-2 text-xs font-bold text-[#454652] border-r border-[#dfe2e9]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="flex-1 px-3 py-2 text-xs text-[#181c21] focus:outline-none"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-[11px] font-bold text-[#454652] block mb-1">
                  आपका शहर / राज्य
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-[#dfe2e9] rounded-xl px-3 py-2 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                >
                  {CITIES_LIST.map((c) => (
                    <option key={c.city} value={`${c.city}, ${c.state}`}>
                      {c.city} ({c.state})
                    </option>
                  ))}
                  <option value="अन्य शहर / राज्य">अन्य शहर / राज्य</option>
                </select>
              </div>
            </div>

            {/* STEP 2: Poster Type & Specs */}
            <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-[#e5e8ef] pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[11px] font-bold">2</span>
                <h4 className="text-xs font-bold text-[#181c21]">पोस्टर का प्रकार व साइज़</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Poster Category Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-[#454652] block mb-1">
                    पोस्टर किस काम के लिए चाहिए? <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <select
                    value={posterCategory}
                    onChange={(e) => setPosterCategory(e.target.value)}
                    className="w-full bg-white border border-[#dfe2e9] rounded-xl px-2.5 py-2 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                  >
                    <option value="त्यौहार / पर्व ग्रीटिंग व सेल">त्यौहार / पर्व ग्रीटिंग व सेल (दिवाली, होली आदि)</option>
                    <option value="दुकान / शोरूम / व्यापार विज्ञापन">दुकान / शोरूम / व्यापार विज्ञापन पोस्टर</option>
                    <option value="रेस्टोरेंट / कैफ़े मेन्यू व फ़ूड कॉम्बो">रेस्टोरेंट / कैफ़े मेन्यू व फ़ूड कॉम्बो</option>
                    <option value="राजनीतिक / चुनाव प्रचार व बधाई">राजनीतिक / चुनाव प्रचार व बधाई पोस्टर</option>
                    <option value="जन्मदिन / शादी / व्यक्तिगत बधाई">जन्मदिन / शादी / व्यक्तिगत बधाई</option>
                    <option value="यूट्यूब थंबनेल व सोशल मीडिया रील">यूट्यूब थंबनेल व रील कवर</option>
                    <option value="कोचिंग / स्कूल / एडमिशन पोस्टर">कोचिंग / स्कूल / एडमिशन व संस्थान</option>
                    <option value="अन्य विशिष्ट पोस्टर डिज़ाइन">अन्य विशिष्ट पोस्टर डिज़ाइन</option>
                  </select>
                </div>

                {/* Poster Size Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-[#454652] block mb-1">
                    पोस्टर का साइज़ (आकार)
                  </label>
                  <select
                    value={posterSize}
                    onChange={(e) => setPosterSize(e.target.value)}
                    className="w-full bg-white border border-[#dfe2e9] rounded-xl px-2.5 py-2 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                  >
                    <option value="1:1 स्क्वायर (Instagram / WhatsApp पोस्ट)">1:1 स्क्वायर (Instagram / WhatsApp पोस्ट)</option>
                    <option value="9:16 वर्टिकल (WhatsApp स्टेटस व Story)">9:16 वर्टिकल (WhatsApp स्टेटस व Story)</option>
                    <option value="हॉरिजॉन्टल बैनर / फ्लैक्स बोर्ड">हॉरिजॉन्टल बैनर / फ्लैक्स बोर्ड</option>
                    <option value="A4 / A3 प्रिंटेबल PDF (दुकान पर लगाने हेतु)">A4 / A3 प्रिंटेबल PDF (प्रिंट शॉप हेतु)</option>
                  </select>
                </div>
              </div>

              {/* Language Preference */}
              <div>
                <label className="text-[11px] font-bold text-[#454652] block mb-1">
                  पोस्टर की भाषा
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['शुद्ध हिंदी', 'हिंदी व अंग्रेज़ी मिक्स', 'केवल English'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguagePreference(lang)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                        languagePreference === lang
                          ? 'bg-[#1a237e] text-white border-[#1a237e]'
                          : 'bg-white text-[#454652] border-[#dfe2e9]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: Poster Content & Voice Note */}
            <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-[#e5e8ef] pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[11px] font-bold">3</span>
                <h4 className="text-xs font-bold text-[#181c21]">पोस्टर में क्या-क्या लिखवाना है?</h4>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#454652] block mb-1">
                  टेक्स्ट विवरण (हेडिंग, डिस्काउंट, दुकान का नाम, पता, फ़ोन नंबर आदि)
                </label>
                <textarea
                  rows={3}
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  placeholder="उदा. दीपावली धमाका सेल! सभी सामान पर 25% की भारी छूट। शर्मा जी की दुकान, घंटाघर चौक, देहरादून। फ़ोन: 98970XXXXX"
                  className="w-full bg-white border border-[#dfe2e9] rounded-xl p-2.5 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                />
              </div>

              {/* Voice Note Recording Component */}
              <VoiceNoteRecorder
                audioUrl={voiceNoteAudioUrl}
                onAudioChange={(url, duration) => {
                  setVoiceNoteAudioUrl(url);
                  setVoiceNoteDuration(duration);
                }}
              />
            </div>

            {/* STEP 4: Photo & Logo Upload */}
            <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-[#e5e8ef] pb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[11px] font-bold">4</span>
                  <h4 className="text-xs font-bold text-[#181c21]">फ़ोटो व लोगो अपलोड करें</h4>
                </div>
                <span className="text-[10px] text-[#767683]">अधिकतम 4 तस्वीरें</span>
              </div>

              <p className="text-[11px] text-[#454652]">
                पोस्टर में लगाने के लिए अपनी फ़ोटो, दुकान का लोगो, या किसी पुराने पोस्टर का सैंपल जोड़ें।
              </p>

              {/* Upload trigger button */}
              <div className="flex items-center gap-2">
                <label className="flex-1 bg-white border-2 border-dashed border-[#8690ee] hover:border-[#1a237e] text-[#1a237e] py-3 px-4 rounded-2xl cursor-pointer flex flex-col items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[26px]">add_photo_alternate</span>
                  <span className="text-xs font-bold mt-1">फ़ोटो / लोगो चुनें</span>
                  <span className="text-[10px] text-[#767683]">JPG, PNG, WebP (गैलरी से चुनें)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Thumbnail Gallery */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative w-full h-18 rounded-xl overflow-hidden border border-[#dfe2e9] bg-white group">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-[#ba1a1a] text-white rounded-full flex items-center justify-center text-[12px] shadow-sm"
                        title="हटाएं"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 5: Turnaround Speed & Source Files */}
            <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-[#e5e8ef] pb-1.5">
                <span className="w-5 h-5 rounded-full bg-[#1a237e] text-white flex items-center justify-center text-[11px] font-bold">5</span>
                <h4 className="text-xs font-bold text-[#181c21]">डिलीवरी समय व स्रोत फ़ाइलें</h4>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSpeed('standard')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    speed === 'standard'
                      ? 'bg-[#e0e0ff] border-[#1a237e] text-[#1a237e]'
                      : 'bg-white border-[#dfe2e9] text-[#454652]'
                  }`}
                >
                  <div className="text-[11px] font-bold">स्टैंडर्ड</div>
                  <div className="text-[10px] text-[#767683]">24 घंटे में</div>
                  <div className="text-[10px] font-semibold mt-0.5">+₹0</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSpeed('express')}
                  className={`p-2 rounded-xl border text-left transition-all relative ${
                    speed === 'express'
                      ? 'bg-[#a3f69c]/40 border-[#1b6d24] text-[#002204]'
                      : 'bg-white border-[#dfe2e9] text-[#454652]'
                  }`}
                >
                  <span className="absolute -top-1.5 right-1 bg-[#1b6d24] text-white text-[8px] font-bold px-1.5 rounded-full">
                    पॉपुलर
                  </span>
                  <div className="text-[11px] font-bold">एक्सप्रेस</div>
                  <div className="text-[10px] text-[#767683]">4 घंटे में</div>
                  <div className="text-[10px] font-semibold mt-0.5 text-[#1b6d24]">+₹120</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSpeed('lightning')}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    speed === 'lightning'
                      ? 'bg-[#ffddb8] border-[#d48700] text-[#2a1700]'
                      : 'bg-white border-[#dfe2e9] text-[#454652]'
                  }`}
                >
                  <div className="text-[11px] font-bold">सुपरफास्ट</div>
                  <div className="text-[10px] text-[#767683]">2 घंटे में</div>
                  <div className="text-[10px] font-semibold mt-0.5 text-[#d48700]">+₹250</div>
                </button>
              </div>

              {/* Editable Source Files */}
              <div className="bg-white p-2.5 rounded-xl border border-[#dfe2e9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sourceCheck"
                    checked={includeSourceFiles}
                    onChange={(e) => setIncludeSourceFiles(e.target.checked)}
                    className="w-4 h-4 text-[#1a237e] rounded"
                  />
                  <label htmlFor="sourceCheck" className="text-xs font-semibold text-[#181c21] cursor-pointer">
                    एडिटेबल Canva / Photoshop स्रोत फ़ाइल भी चाहिए
                  </label>
                </div>
                <span className="text-xs font-bold text-[#1a237e]">+₹99</span>
              </div>
            </div>

            {/* Live Pricing Breakdown */}
            <div className="bg-[#e0e0ff]/50 p-3.5 rounded-2xl flex items-center justify-between border border-[#8690ee]/30">
              <div>
                <span className="text-[10px] font-bold text-[#767683] uppercase tracking-wider">
                  कुल देय राशि (ऑफर सहित)
                </span>
                <p className="text-xl font-extrabold text-[#1a237e]">₹{grandTotal}</p>
              </div>
              <div className="text-right">
                <span className="bg-[#a3f69c] text-[#002204] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  100% संतुष्टि गारंटी
                </span>
                <p className="text-[10px] text-[#767683] mt-0.5">अनलिमिटेड संशोधन शामिल</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-1 sticky bottom-0 bg-white pb-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1a237e] hover:bg-[#000666] text-white py-3.5 px-4 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>डेटाबेस में ऑर्डर सेव हो रहा है...</span>
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>ऑर्डर कन्फर्म करें • ₹{grandTotal}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

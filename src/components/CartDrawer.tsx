import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onClearCart: () => void;
  onCheckoutComplete: (orderTotal: number, address: string) => void;
  selectedCity: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
  onCheckoutComplete,
  selectedCity
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('फ्लैट 402, पाइन व्यू रेजीडेंसी, राजपुर रोड, देहरादून 248001');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const deliveryFee = subtotal > 500 ? 0 : 49;
  const finalTotal = subtotal - discountAmount + deliveryFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'HIMALAYA10' || code === 'FRESHMOUNTAIN') {
      setDiscountPercent(10);
      setPromoSuccess('10% हिमालयी छूट कोड लागू हुआ!');
    } else if (code === 'PUREA2') {
      setDiscountPercent(15);
      setPromoSuccess('15% शुद्धता उत्सव कोड लागू हुआ!');
    } else {
      setPromoError('अमान्य कोड। HIMALAYA10 या PUREA2 आज़माएं');
    }
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderConfirmed(true);
      onCheckoutComplete(finalTotal, deliveryAddress);
      setTimeout(() => {
        setOrderConfirmed(false);
        onClose();
        onClearCart();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 relative overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="bg-[#1a237e] text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            <div>
              <h2 className="text-base font-bold">आपकी खरीदारी टोकरी</h2>
              <p className="text-[11px] text-[#8690ee]">सीधे पहाड़ों से ताज़ा • 100% शुद्ध</p>
            </div>
          </div>
          <button 
            id="close-cart-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Confirmation Screen */}
        {orderConfirmed ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-full bg-[#a3f69c] text-[#002204] flex items-center justify-center mb-4 shadow-lg ring-8 ring-[#a3f69c]/20">
              <span className="material-symbols-outlined text-[42px] font-bold">check</span>
            </div>
            <h3 className="text-xl font-bold text-[#181c21]">ऑर्डर सफलतापूर्वक दर्ज हुआ!</h3>
            <p className="text-xs text-[#454652] mt-2 max-w-xs leading-relaxed">
              ऑर्डर #ZH-{Math.floor(1000 + Math.random() * 9000)} स्वीकृत हो गया है। आपकी ताज़ा जैविक सामग्री पैकिंग विभाग में भेज दी गई है।
            </p>
            <div className="bg-[#f1f4fb] p-3 rounded-xl mt-4 w-full text-xs text-[#1a237e] font-semibold">
              अनुमानित आगमन: आज शाम 4:30 तक ({selectedCity})
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <span className="material-symbols-outlined text-5xl text-[#dfe2e9]">eco</span>
                  <p className="text-sm font-bold text-[#181c21] mt-2">टोकरी खाली है</p>
                  <p className="text-xs text-[#767683] mt-1">शुद्ध बद्री गाय घी, शहद या मंडुआ अनाज जोड़ें।</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2.5">
                    {cart.map((item) => (
                      <div 
                        key={item.product.id}
                        className="bg-[#f7f9ff] p-3 rounded-2xl border border-[#dfe2e9] flex items-center justify-between gap-3"
                      >
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-14 h-14 rounded-xl object-cover bg-white border border-[#e5e8ef]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#181c21] truncate">{item.product.name}</h4>
                          <p className="text-[10px] text-[#767683]">{item.product.weight} • {item.product.harvestAltitude}</p>
                          <p className="text-xs font-bold text-[#1a237e] mt-1">₹{item.product.price * item.quantity}</p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center bg-white rounded-full p-0.5 border border-[#dfe2e9] shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-full bg-[#f1f4fb] hover:bg-[#ffdad6] text-[#181c21] flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-[#181c21]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-full bg-[#1b6d24] text-white flex items-center justify-center text-xs font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="mt-2">
                    <label className="text-[11px] font-bold text-[#454652] block mb-1">
                      छूट कूपन कोड
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="उदा. HIMALAYA10 या PUREA2"
                        className="flex-1 border border-[#dfe2e9] rounded-xl px-3 py-2 text-xs uppercase font-semibold focus:outline-none focus:border-[#1a237e]"
                      />
                      <button
                        type="submit"
                        className="bg-[#1a237e] text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-xs"
                      >
                        लागू करें
                      </button>
                    </div>
                    {promoSuccess && <p className="text-[10px] text-[#1b6d24] font-bold mt-1">✓ {promoSuccess}</p>}
                    {promoError && <p className="text-[10px] text-[#ba1a1a] font-bold mt-1">{promoError}</p>}
                  </form>

                  {/* Delivery Address */}
                  <div className="mt-2 bg-[#f1f4fb] p-3 rounded-2xl border border-[#dfe2e9]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-[#181c21]">डिलीवरी पता ({selectedCity})</span>
                      <span className="text-[10px] text-[#1b6d24] font-bold">सत्यापित पिनकोड</span>
                    </div>
                    <textarea
                      rows={2}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs text-[#454652] bg-white p-2 rounded-xl border border-[#dfe2e9] focus:outline-none"
                    />
                  </div>

                  {/* Payment Mode Selector */}
                  <div className="mt-1">
                    <span className="text-[11px] font-bold text-[#181c21] block mb-1.5">सुरक्षित भुगतान विकल्प</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-[#e0e0ff] border-[#1a237e] text-[#1a237e]'
                            : 'bg-white border-[#dfe2e9] text-[#454652]'
                        }`}
                      >
                        UPI / GPay
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          paymentMethod === 'cod'
                            ? 'bg-[#a3f69c]/50 border-[#1b6d24] text-[#1b6d24]'
                            : 'bg-white border-[#dfe2e9] text-[#454652]'
                        }`}
                      >
                        कैश ऑन डिलीवरी
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-[#ffddb8] border-[#d48700] text-[#2a1700]'
                            : 'bg-white border-[#dfe2e9] text-[#454652]'
                        }`}
                      >
                        कार्ड / नेटबैंकिंग
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer with Bill Breakdown */}
            {cart.length > 0 && (
              <div className="p-4 bg-white border-t border-[#dfe2e9] shadow-lg">
                <div className="flex flex-col gap-1 text-xs text-[#454652] mb-3">
                  <div className="flex justify-between">
                    <span>उपकुल (Subtotal)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-[#1b6d24] font-semibold">
                      <span>कूपन छूट ({discountPercent}%)</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>पहाड़ी डिलीवरी शुल्क</span>
                    <span>{deliveryFee === 0 ? <span className="text-[#1b6d24] font-bold">मुफ़्त</span> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#181c21] pt-1.5 border-t border-[#f1f4fb]">
                    <span>कुल देय राशि</span>
                    <span className="text-[#1a237e]">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  id="confirm-checkout-btn"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting}
                  className="w-full bg-[#1b6d24] hover:bg-[#155a1d] text-white py-3.5 px-4 rounded-full text-sm font-bold shadow-[0_8px_20px_rgba(27,109,36,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>ऑर्डर दर्ज किया जा रहा है...</span>
                    </span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                      <span>ऑर्डर कन्फ़र्म करें • ₹{finalTotal}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

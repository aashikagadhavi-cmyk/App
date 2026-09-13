import React, { useState } from 'react';
import { ORGANIC_PRODUCTS, MOUNTAIN_HERO_URL } from '../data/mockData';
import { ProductItem, CartItem } from '../types';

interface StoreViewProps {
  cart: CartItem[];
  onAddToCart: (product: ProductItem) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onOpenCart: () => void;
  onSelectProduct: (product: ProductItem) => void;
  selectedCity: string;
  onOpenLocationModal: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onOpenCart,
  onSelectProduct,
  selectedCity,
  onOpenLocationModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('सभी');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFarmerBadge, setActiveFarmerBadge] = useState<string | null>(null);

  const categories = ['सभी', 'शुद्ध घी', 'जंगली शहद', 'पहाड़ी मोटा अनाज', 'जैविक दालें', 'पारंपरिक मसाले'];

  const filteredProducts = ORGANIC_PRODUCTS.filter(product => {
    const matchesCat = activeCategory === 'सभी' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const getProductQuantityInCart = (productId: string) => {
    const found = cart.find(item => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Organic Header & Search Bar */}
      <section className="bg-[#1a237e] text-white px-4 sm:px-5 pt-3 pb-7 rounded-b-[2rem] shadow-[0_12px_28px_-4px_rgba(26,35,126,0.25)] relative z-10">
        <div className="max-w-md mx-auto">
          {/* Delivery Location Selector Pill */}
          <div className="flex items-center justify-between mb-3.5">
            <button
              id="deliver-to-selector"
              onClick={onOpenLocationModal}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full text-white text-xs font-medium shadow-xs cursor-pointer active:scale-95 transition-all border border-white/15"
            >
              <span className="material-symbols-outlined text-[#a3f69c] text-[18px]">location_on</span>
              <span className="text-white text-xs">
                डिलीवरी पता: <span className="font-bold text-[#a3f69c]">{selectedCity}</span>
              </span>
              <span className="material-symbols-outlined text-white/80 text-[16px]">expand_more</span>
            </button>

            <div className="flex items-center gap-1 bg-[#1b6d24] text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              <span>100% शुद्ध प्रमाणित</span>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative flex items-center">
            <div className="w-full bg-white text-[#181c21] rounded-full shadow-[0_8px_20px_0_rgba(0,0,0,0.12)] flex items-center px-4 py-2.5">
              <span className="material-symbols-outlined text-[#767683] text-[22px] mr-2">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="बद्री गाय घी, जंगली शहद, मंडुआ (रागी) खोजें..."
                className="bg-transparent border-none outline-none w-full text-xs sm:text-sm text-[#181c21] placeholder:text-[#767683]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[#767683] hover:text-[#181c21] p-1 mr-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Pills Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar -mx-4 px-4 sm:-mx-5 sm:px-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs transition-all shrink-0 flex items-center gap-1 ${
                  activeCategory === cat
                    ? 'bg-white text-[#1a237e] font-bold shadow-xs scale-102'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                <span>{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Himalayan Naturals Showcase Card */}
      <section className="max-w-md mx-auto w-full px-4 sm:px-5 mt-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#f1f4fb] shadow-[0_8px_24px_0_rgba(26,35,126,0.06)] border border-[#e5e8ef] flex flex-col group">
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={MOUNTAIN_HERO_URL}
              alt="उत्तराखंड हिमालयी घाटी"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            
            {/* Top altitude badge */}
            <div className="absolute top-3 left-3 bg-[#1b6d24]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-xs">
              <span className="material-symbols-outlined text-[14px]">nature_people</span>
              <span>6,800 फीट की ऊंचाई से प्राप्त</span>
            </div>
            
            {/* Purity certification seal */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1a237e] px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <span>FSSAI • 100% जैविक</span>
            </div>
          </div>

          <div className="p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[#1b6d24] text-[11px] uppercase tracking-wider font-bold">
                मूल हिमालयी गारंटी
              </span>
              <span className="text-xs text-[#454652] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#1b6d24]">local_shipping</span>
                अगले दिन घर पर डिलीवरी
              </span>
            </div>
            <h2 className="text-[17px] font-bold text-[#181c21] mt-1 tracking-tight">
              प्रामाणिक उत्तराखंड जैविक उत्पाद
            </h2>
            <p className="text-xs text-[#454652] mt-1 leading-relaxed">
              पारंपरिक हिमालयी पद्धतियों और प्राकृतिक पर्वतीय जल स्रोतों से उत्पादित शुद्ध जैविक फसल।
            </p>
          </div>
        </div>
      </section>

      {/* Curated Product Catalog Section */}
      <section className="max-w-md mx-auto w-full px-4 sm:px-5 mt-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-[#1b6d24] font-bold">
              पहाड़ी रसोई भंडार
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#181c21] tracking-tight">
              ताज़ा पहाड़ी उपज
            </h3>
          </div>
          <span className="text-xs text-[#1a237e] font-bold bg-[#e0e0ff] px-2.5 py-1 rounded-full">
            {filteredProducts.length} उत्पाद
          </span>
        </div>

        {/* Product Cards List */}
        <div className="flex flex-col gap-3.5">
          {filteredProducts.map((product) => {
            const qty = getProductQuantityInCart(product.id);

            return (
              <article
                key={product.id}
                className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-[0_4px_14px_-2px_rgba(26,35,126,0.06)] border border-[#e5e8ef]/80 flex flex-col gap-2.5 transition-all hover:border-[#a3f69c]"
              >
                <div className="flex gap-3 sm:gap-4">
                  {/* Product Thumbnail */}
                  <div 
                    onClick={() => onSelectProduct(product)}
                    className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-[#e5e8ef] cursor-pointer group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#ffddb8] text-[#2a1700] px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                      <span className="material-symbols-outlined text-[12px] text-[#2a1700] material-symbols-filled">
                        star
                      </span>
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.tagColor}`}>
                          {product.tag}
                        </span>
                        <span className="text-[11px] text-[#767683] font-medium">
                          {product.weight}
                        </span>
                      </div>

                      <h4 
                        onClick={() => onSelectProduct(product)}
                        className="text-sm font-bold text-[#181c21] mt-1 line-clamp-1 cursor-pointer hover:text-[#1a237e] transition-colors"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#454652] line-clamp-2 mt-0.5 leading-snug">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Price and Add/Quantity Actions */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f1f4fb]">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-[#1a237e]">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-[#767683] line-through">
                          ₹{product.originalPrice}
                        </span>
                      </div>

                      {qty === 0 ? (
                        <button
                          id={`add-btn-${product.id}`}
                          onClick={() => onAddToCart(product)}
                          className="bg-[#1a237e] hover:bg-[#155a1d] text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                          <span>जोड़ें</span>
                        </button>
                      ) : (
                        <div className="flex items-center bg-[#f1f4fb] rounded-full p-0.5 border border-[#1b6d24]/30 shadow-xs">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="w-7 h-7 rounded-full bg-white text-[#181c21] hover:bg-[#ffdad6] flex items-center justify-center font-bold text-sm active:scale-90 transition-transform shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#181c21]">
                            {qty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="w-7 h-7 rounded-full bg-[#1b6d24] text-white hover:bg-[#155a1d] flex items-center justify-center font-bold text-sm active:scale-90 transition-transform shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Direct from Himalayan Farmers Guarantee Card */}
      <section className="max-w-md mx-auto w-full px-4 sm:px-5 mt-6 mb-2">
        <div className="bg-gradient-to-br from-[#1a237e] to-[#000666] text-white rounded-2xl p-5 shadow-[0_12px_28px_-4px_rgba(26,35,126,0.25)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#a3f69c] text-[#002204] flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#a3f69c] font-bold">
                  100% शुद्धता प्रमाण
                </span>
                <h4 className="text-[16px] font-bold text-white leading-tight">
                  पहाड़ी किसानों से सीधा संपर्क
                </h4>
              </div>
            </div>

            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              प्रत्येक बैच की प्रयोगशाला में जांच की जाती है। बिना किसी बिचौलिए के सही दाम सीधे हमारे स्थानीय पहाड़ी किसान समूहों को मिलता है।
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 mt-1">
              <button
                onClick={() => setActiveFarmerBadge('lab')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-2.5 flex flex-col items-center text-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[#a3f69c] text-[20px] mb-1">science</span>
                <span className="text-[11px] text-white leading-tight font-bold">लैब टेस्टेड</span>
              </button>

              <button
                onClick={() => setActiveFarmerBadge('pay')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-2.5 flex flex-col items-center text-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[#a3f69c] text-[20px] mb-1">handshake</span>
                <span className="text-[11px] text-white leading-tight font-bold">किसान सम्मान</span>
              </button>

              <button
                onClick={() => setActiveFarmerBadge('pesticides')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-2.5 flex flex-col items-center text-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[#a3f69c] text-[20px] mb-1">eco</span>
                <span className="text-[11px] text-white leading-tight font-bold">शून्य रसायन</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Verification Modal */}
      {activeFarmerBadge && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfe2e9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1b6d24]">verified</span>
                <h3 className="text-sm font-bold text-[#181c21]">
                  {activeFarmerBadge === 'lab' && 'लैब परीक्षण प्रमाण #UK-9481'}
                  {activeFarmerBadge === 'pay' && 'किसान प्रत्यक्ष भुगतान बहीखाता'}
                  {activeFarmerBadge === 'pesticides' && 'प्रमाणित शून्य कीटनाशक अवशेष'}
                </h3>
              </div>
              <button 
                onClick={() => setActiveFarmerBadge(null)}
                className="w-7 h-7 rounded-full bg-[#f1f4fb] flex items-center justify-center text-[#454652]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="py-3 text-xs text-[#454652] flex flex-col gap-2 leading-relaxed">
              {activeFarmerBadge === 'lab' && (
                <>
                  <p className="font-semibold text-[#181c21]">NABL प्रमाणित प्रयोगशाला रिपोर्ट:</p>
                  <p>शुद्ध A2 बद्री गाय बिलोना घी और जंगली शहद में मिलावट की शून्य संभावना। गुणवत्ता और पौष्टिकता शत-प्रतिशत प्रमाणित।</p>
                  <div className="bg-[#f1f4fb] p-2 rounded-lg font-mono text-[10px] text-[#1a237e]">
                    स्थिति: उत्तीर्ण (PASS) • बैच: ALM-2026-09
                  </div>
                </>
              )}
              {activeFarmerBadge === 'pay' && (
                <>
                  <p className="font-semibold text-[#181c21]">पारदर्शी भुगतान:</p>
                  <p>बिक्री का 72% सीधा जौनसार और अल्मोड़ा की महिला स्वयं सहायता समूहों को मिलता है।</p>
                  <div className="bg-[#f1f4fb] p-2 rounded-lg text-[11px] text-[#1b6d24] font-semibold">
                    18 पहाड़ी गांवों के 140+ किसान परिवारों का सीधा सशक्तिकरण।
                  </div>
                </>
              )}
              {activeFarmerBadge === 'pesticides' && (
                <>
                  <p className="font-semibold text-[#181c21]">शुद्ध मिट्टी व हिमनद जल:</p>
                  <p>पहाड़ों के प्राकृतिक बर्फ़ानी झरनों से सिंचाई। कोई रासायनिक खाद या कीटनाशक नहीं।</p>
                  <div className="bg-[#f1f4fb] p-2 rounded-lg text-[11px] text-[#181c21]">
                    180 रसायनों की जांच: 0 मिले (शून्य अवशेष)।
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setActiveFarmerBadge(null)}
              className="w-full bg-[#1a237e] text-white py-2.5 rounded-full text-xs font-bold mt-1"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* Interactive Floating Quick Cart Status Bar */}
      {cartTotalItems > 0 && (
        <aside 
          id="floating-cart"
          className="fixed bottom-20 inset-x-0 z-30 px-4 sm:px-5 pointer-events-none"
        >
          <div className="max-w-md mx-auto pointer-events-auto bg-[#1b6d24] text-white rounded-full px-4 py-2.5 shadow-[0_12px_32px_rgba(27,109,36,0.38)] flex items-center justify-between animate-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                </span>
                <span className="absolute -top-1 -right-1 bg-[#1a237e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartTotalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">
                  {cartTotalItems} उत्पाद जोड़े गए • ₹{cartTotalPrice}
                </span>
                <span className="text-[10px] text-[#a3f69c] opacity-95 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a3f69c] animate-pulse"></span>
                  डिलीवरी के लिए तैयार
                </span>
              </div>
            </div>

            <button
              id="view-basket-btn"
              onClick={onOpenCart}
              className="bg-white text-[#1b6d24] text-xs font-bold px-4 py-2 rounded-full shadow-xs active:scale-95 transition-transform flex items-center gap-1 hover:bg-[#f1f4fb]"
            >
              <span>टोकरी देखें</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

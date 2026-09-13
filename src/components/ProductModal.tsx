import React from 'react';
import { ProductItem } from '../types';

interface ProductModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onAddToCart: (product: ProductItem) => void;
  quantityInCart: number;
  onUpdateQuantity: (productId: string, delta: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  quantityInCart,
  onUpdateQuantity
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#dfe2e9] animate-in zoom-in-95">
        
        {/* Product Image Header */}
        <div className="relative h-60 w-full bg-[#e5e8ef]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="absolute bottom-3 left-3 bg-[#1b6d24]/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <span className="material-symbols-outlined text-[15px]">terrain</span>
            <span>{product.harvestAltitude}</span>
          </div>
        </div>

        {/* Product Body */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${product.tagColor}`}>
                {product.tag}
              </span>
              <span className="text-xs text-[#767683] font-semibold">{product.weight}</span>
            </div>

            <h3 className="text-lg font-bold text-[#181c21] mt-1.5">{product.name}</h3>
            <p className="text-xs text-[#454652] mt-1 leading-relaxed">{product.subtitle}</p>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#1a237e]">₹{product.price}</span>
                <span className="text-sm text-[#767683] line-through">₹{product.originalPrice}</span>
              </div>
              <span className="text-[11px] text-[#1b6d24] font-bold bg-[#a3f69c]/30 px-2 py-0.5 rounded">
                बचत ₹{product.originalPrice - product.price}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#f7f9ff] p-3.5 rounded-2xl border border-[#dfe2e9]">
            <h4 className="text-xs font-bold text-[#181c21] mb-1">उत्पादन विधि व विशेषताएं</h4>
            <p className="text-xs text-[#454652] leading-relaxed">{product.description}</p>
          </div>

          {/* Key Benefits */}
          <div>
            <h4 className="text-xs font-bold text-[#181c21] mb-2">स्वास्थ्य व पौष्टिकता लाभ</h4>
            <div className="flex flex-col gap-1.5">
              {product.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#181c21]">
                  <span className="material-symbols-outlined text-[#1b6d24] text-[18px]">check_circle</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer Co-op origin */}
          <div className="flex items-center gap-3 bg-[#e0e0ff]/40 p-3 rounded-2xl border border-[#1a237e]/15">
            <div className="w-10 h-10 rounded-full bg-[#1a237e] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1a237e] tracking-wider">उत्पादक समूह</span>
              <p className="text-xs font-bold text-[#181c21]">{product.farmerGroup}</p>
              <p className="text-[10px] text-[#454652]">{product.origin}</p>
            </div>
          </div>

          {/* Add to Basket Action */}
          <div className="pt-2 border-t border-[#f1f4fb]">
            {quantityInCart === 0 ? (
              <button
                onClick={() => onAddToCart(product)}
                className="w-full bg-[#1b6d24] hover:bg-[#155a1d] text-white py-3 px-4 rounded-full text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                <span>टोकरी में जोड़ें • ₹{product.price}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-[#f1f4fb] p-2 rounded-full border border-[#1b6d24]">
                <div className="flex items-center gap-2 px-3">
                  <span className="text-xs font-bold text-[#181c21]">टोकरी में:</span>
                  <span className="text-xs font-extrabold text-[#1b6d24]">{quantityInCart} उत्पाद</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQuantity(product.id, -1)}
                    className="w-8 h-8 rounded-full bg-white text-[#181c21] flex items-center justify-center font-bold text-sm shadow-xs active:scale-90 transition-transform"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    className="w-8 h-8 rounded-full bg-[#1b6d24] text-white flex items-center justify-center font-bold text-sm shadow-xs active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

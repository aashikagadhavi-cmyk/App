import React, { useState } from 'react';
import { OrderItem } from '../types';

interface OrdersViewProps {
  orders: OrderItem[];
  onOpenStore: () => void;
  onOpenCreativeModal?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onOpenStore, onOpenCreativeModal }) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadProof = (orderNumber: string) => {
    setDownloadSuccess(`ऑर्डर #${orderNumber} की फ़ाइलें व रसीद सफलतापूर्वक डाउनलोड हो गई!`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Top Banner */}
      <div className="bg-[#1a237e] text-white px-4 sm:px-5 pt-3 pb-6 rounded-b-[28px] shadow-[0_12px_28px_rgba(26,35,126,0.25)]">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#8690ee] uppercase tracking-wider">
                ऑर्डर स्थिति व ट्रैकिंग
              </span>
              <h2 className="text-[19px] font-bold text-white mt-0.5">मेरे ऑर्डर व डिलीवरी</h2>
            </div>
            <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
              {orders.length} सक्रिय ऑर्डर
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto w-full px-4 sm:px-5 mt-4 flex flex-col gap-4">
        
        {downloadSuccess && (
          <div className="bg-[#a3f69c] text-[#002204] p-3 rounded-2xl flex items-center gap-2 text-xs font-bold shadow-xs animate-in fade-in">
            <span className="material-symbols-outlined text-[20px]">cloud_done</span>
            <span>{downloadSuccess}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center flex flex-col items-center gap-3 border border-[#dfe2e9]">
            <span className="material-symbols-outlined text-4xl text-[#767683]">package_2</span>
            <h3 className="text-base font-bold text-[#181c21]">अभी कोई ऑर्डर नहीं है</h3>
            <p className="text-xs text-[#454652] max-w-xs">
              हिमालयी शुद्ध जैविक उत्पाद खरीदें या अपनी दुकान/त्यौहार के लिए तुरंत पोस्टर ऑर्डर करें।
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
              {onOpenCreativeModal && (
                <button
                  onClick={onOpenCreativeModal}
                  className="flex-1 bg-[#1a237e] text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-xs"
                >
                  पोस्टर ऑर्डर करें
                </button>
              )}
              <button
                onClick={onOpenStore}
                className="flex-1 bg-[#1b6d24] text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-xs"
              >
                पहाड़ी उत्पाद खरीदें
              </button>
            </div>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 shadow-[0_4px_14px_-2px_rgba(26,35,126,0.06)] border border-[#e5e8ef] flex flex-col gap-3"
            >
              {/* Top info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.type === 'organic' ? 'bg-[#a3f69c] text-[#002204]' : 'bg-[#e0e0ff] text-[#000767]'
                  }`}>
                    {order.type === 'organic' ? 'जैविक उत्पाद' : 'पोस्टर / स्टूडियो'}
                  </span>
                  <span className="text-xs font-bold text-[#1a237e]">#{order.orderNumber}</span>
                </div>
                <span className="text-[11px] text-[#767683]">{order.date}</span>
              </div>

              {/* Order item details */}
              <div className="flex gap-3 items-center bg-[#f7f9ff] p-2.5 rounded-xl border border-[#ebeef5]">
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-white border border-[#dfe2e9]">
                  <img src={order.imageThumbnail || (order.uploadedImages && order.uploadedImages[0])} alt={order.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#181c21] truncate">{order.title}</h4>
                  <p className="text-[11px] text-[#454652] truncate">
                    {order.customerName ? `${order.customerName} • ` : ''}{order.deliveryAddress}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-bold text-[#1a237e]">₹{order.total}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'पूर्ण' || order.status === 'Completed'
                        ? 'bg-[#a3f69c] text-[#002204]'
                        : 'bg-[#ffddb8] text-[#2a1700] animate-pulse'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery ETA status indicator */}
              <div className="flex items-center gap-1.5 text-xs text-[#1b6d24] font-semibold bg-[#a3f69c]/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>{order.eta}</span>
              </div>

              {/* WhatsApp direct chat button if number exists */}
              {order.whatsappNumber && (
                <a
                  href={`https://wa.me/91${order.whatsappNumber}?text=${encodeURIComponent(
                    `नमस्ते! मेरे ऑर्डर #${order.orderNumber} का क्या स्टेटस है?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#f1f4fb] hover:bg-[#ebeef5] text-[#1b6d24] text-[11px] font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">chat</span>
                  <span>WhatsApp पर सहायता प्राप्त करें (+91 {order.whatsappNumber})</span>
                </a>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#f1f4fb]">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 bg-[#f1f4fb] hover:bg-[#e0e0ff] text-[#1a237e] text-xs font-bold py-2 rounded-full transition-colors flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">timeline</span>
                  <span>समयरेखा देखें</span>
                </button>

                <button
                  onClick={() => handleDownloadProof(order.orderNumber)}
                  className="flex-1 bg-[#1a237e] hover:bg-[#000666] text-white text-xs font-bold py-2 rounded-full transition-colors flex items-center justify-center gap-1 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>{order.type === 'creative' ? 'फ़ाइलें पाएं' : 'रसीद'}</span>
                </button>
              </div>
            </div>
          ))
        )}

      </div>

      {/* Timeline Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#dfe2e9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a237e]">timeline</span>
                <h3 className="text-sm font-bold text-[#181c21]">ऑर्डर स्थिति #{selectedOrder.orderNumber}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-[#f1f4fb] flex items-center justify-center text-[#454652]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="py-4 flex flex-col gap-4">
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-[#1b6d24] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#181c21]">ऑर्डर दर्ज और स्वीकार हुआ</p>
                  <p className="text-[10px] text-[#767683]">डेटाबेस में सुरक्षित • ऑर्डर आईडी #{selectedOrder.orderNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedOrder.status !== 'नया ऑर्डर' ? 'bg-[#1b6d24] text-white' : 'bg-[#1a237e] text-white animate-pulse'
                }`}>
                  {selectedOrder.status !== 'नया ऑर्डर' ? '✓' : '●'}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#181c21]">
                    {selectedOrder.type === 'creative' ? 'डिज़ाइनर द्वारा कार्य प्रारंभ' : 'पैकिंग व गुणवत्ता जांच'}
                  </p>
                  <p className="text-[10px] text-[#767683]">
                    {selectedOrder.type === 'creative' ? 'पोस्टर डिज़ाइन बनाया जा रहा है' : 'शुद्धता सील व पैकेजिंग'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedOrder.status === 'पूर्ण' || selectedOrder.status === 'प्रूफ़ तैयार' ? 'bg-[#1b6d24] text-white' : 'bg-[#dfe2e9] text-[#767683]'
                }`}>
                  {selectedOrder.status === 'पूर्ण' ? '✓' : '3'}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#181c21]">
                    {selectedOrder.type === 'creative' ? 'WhatsApp पर प्रूफ़ भेजा गया' : 'डिलीवरी हेतु रवाना'}
                  </p>
                  <p className="text-[10px] text-[#767683]">
                    {selectedOrder.eta}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedOrder.status === 'पूर्ण' ? 'bg-[#1b6d24] text-white' : 'bg-[#dfe2e9] text-[#767683]'
                }`}>
                  {selectedOrder.status === 'पूर्ण' ? '✓' : '4'}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#181c21]">सफलतापूर्वक डिलीवर</p>
                  <p className="text-[10px] text-[#767683]">100% ऑन-टाइम सेवा</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
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

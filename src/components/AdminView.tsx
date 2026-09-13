import React, { useState, useEffect } from 'react';
import { OrderItem } from '../types';

interface AdminViewProps {
  orders: OrderItem[];
  onOrderUpdated: (updatedOrder: OrderItem) => void;
  onOrderDeleted: (orderId: string) => void;
  onRefreshOrders: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  orders,
  onOrderUpdated,
  onOrderDeleted,
  onRefreshOrders
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'creative' | 'organic'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Status updating state in modal
  const [newStatus, setNewStatus] = useState<string>('');
  const [newAdminNotes, setNewAdminNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status);
      setNewAdminNotes(selectedOrder.adminNotes || '');
      setIsPlayingAudio(false);
    }
  }, [selectedOrder]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    if (activeTabFilter !== 'all' && order.type !== activeTabFilter) return false;
    if (activeStatusFilter !== 'all' && order.status !== activeStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = order.orderNumber?.toLowerCase().includes(q);
      const matchName = order.customerName?.toLowerCase().includes(q);
      const matchPhone = order.whatsappNumber?.includes(q);
      const matchCity = order.city?.toLowerCase().includes(q);
      const matchTitle = order.title?.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchCity || matchTitle;
    }
    return true;
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const creativeCount = orders.filter((o) => o.type === 'creative').length;
  const newOrdersCount = orders.filter((o) => o.status === 'नया ऑर्डर').length;
  const inProgressCount = orders.filter((o) => o.status === 'प्रगति पर').length;

  // Handle Save Status & Notes
  const handleSaveStatus = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: newAdminNotes
        })
      });
      const data = await res.json();
      if (data.success && data.order) {
        onOrderUpdated(data.order);
        setSelectedOrder(data.order);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      // Fallback local update
      const updated = {
        ...selectedOrder,
        status: newStatus,
        adminNotes: newAdminNotes
      };
      onOrderUpdated(updated);
      setSelectedOrder(updated);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete Order
  const handleDelete = async (orderId: string) => {
    if (!confirm('क्या आप वाकई इस ऑर्डर को हटाना चाहते हैं?')) return;
    try {
      await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting order:', err);
    }
    onOrderDeleted(orderId);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24 max-w-7xl mx-auto">
      
      {/* Top Admin Banner */}
      <div className="bg-[#1a237e] text-white p-5 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#a3f69c] text-[26px]">
              admin_panel_settings
            </span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-[#8690ee]">
              ऑर्डर प्रबंधन व बैकएंड डेटाबेस
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            एडमिन कंट्रोल पोर्टल
          </h1>
          <p className="text-xs text-[#c4d0f5] mt-1 max-w-xl leading-relaxed">
            यहाँ ग्राहकों के सभी पोस्टर डिज़ाइन अनुरोध, वॉयस नोट्स, अपलोड की गई तस्वीरें और पते लाइव डेटाबेस में सुरक्षित दिखते हैं।
          </p>
        </div>

        <button
          onClick={onRefreshOrders}
          className="self-start md:self-auto bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 active:scale-95 transition-all border border-white/20"
        >
          <span className="material-symbols-outlined text-[18px]">sync</span>
          <span>डेटा रिफ्रेश करें</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#dfe2e9] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#767683]">कुल ऑर्डर्स</span>
            <span className="material-symbols-outlined text-[#1a237e] text-[20px]">receipt_long</span>
          </div>
          <p className="text-2xl font-black text-[#181c21]">{orders.length}</p>
          <span className="text-[11px] text-[#1b6d24] font-semibold flex items-center gap-0.5 mt-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            डेटाबेस सक्रिय
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dfe2e9] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#767683]">नये पेंडिंग ऑर्डर</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
          </div>
          <p className="text-2xl font-black text-[#ba1a1a]">{newOrdersCount}</p>
          <span className="text-[11px] text-[#767683] mt-1 block">तुरंत संपर्क आवश्यक</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dfe2e9] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#767683]">पोस्टर / डिज़ाइन</span>
            <span className="material-symbols-outlined text-[#d48700] text-[20px]">palette</span>
          </div>
          <p className="text-2xl font-black text-[#181c21]">{creativeCount}</p>
          <span className="text-[11px] text-[#767683] mt-1 block">रचनात्मक सेवाएं</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dfe2e9] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-[#767683]">कुल व्यवसाय (राजस्व)</span>
            <span className="material-symbols-outlined text-[#1b6d24] text-[20px]">payments</span>
          </div>
          <p className="text-2xl font-black text-[#1b6d24]">₹{totalRevenue}</p>
          <span className="text-[11px] text-[#1b6d24] font-semibold mt-1 block">कुल ऑर्डर मूल्य</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#dfe2e9] shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTabFilter === 'all'
                ? 'bg-[#1a237e] text-white'
                : 'bg-[#f1f4fb] text-[#454652] hover:bg-[#e0e0ff]'
            }`}
          >
            सभी ({orders.length})
          </button>
          <button
            onClick={() => setActiveTabFilter('creative')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTabFilter === 'creative'
                ? 'bg-[#1a237e] text-white'
                : 'bg-[#f1f4fb] text-[#454652] hover:bg-[#e0e0ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">palette</span>
            <span>पोस्टर / डिज़ाइन ({creativeCount})</span>
          </button>
          <button
            onClick={() => setActiveTabFilter('organic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTabFilter === 'organic'
                ? 'bg-[#1a237e] text-white'
                : 'bg-[#f1f4fb] text-[#454652] hover:bg-[#e0e0ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">eco</span>
            <span>जैविक उत्पाद ({orders.length - creativeCount})</span>
          </button>
        </div>

        {/* Status Dropdown & Search Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={activeStatusFilter}
            onChange={(e) => setActiveStatusFilter(e.target.value)}
            className="bg-[#f1f4fb] border border-[#dfe2e9] text-xs font-semibold text-[#181c21] rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#1a237e]"
          >
            <option value="all">सभी स्थितियां (Status)</option>
            <option value="नया ऑर्डर">नया ऑर्डर</option>
            <option value="प्रगति पर">प्रगति पर</option>
            <option value="प्रूफ़ तैयार">प्रूफ़ तैयार</option>
            <option value="पूर्ण">पूर्ण</option>
            <option value="रद्द">रद्द</option>
          </select>

          <div className="relative flex-1 md:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[18px] text-[#767683]">
              search
            </span>
            <input
              type="text"
              placeholder="नाम, फ़ोन या ID खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-[#f1f4fb] border border-[#dfe2e9] rounded-xl text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
            />
          </div>
        </div>
      </div>

      {/* Orders List / Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#dfe2e9] flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-[48px] text-[#c4d0f5] mb-2">inbox</span>
          <h3 className="text-base font-bold text-[#181c21]">कोई ऑर्डर नहीं मिला</h3>
          <p className="text-xs text-[#767683] mt-1">
            दिए गए फ़िल्टर या खोज के अनुसार कोई ऑर्डर मौजूद नहीं है।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#dfe2e9] hover:border-[#8690ee] shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Order Info Left */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f1f4fb] shrink-0 border border-[#dfe2e9]">
                  <img
                    src={order.imageThumbnail || (order.uploadedImages && order.uploadedImages[0]) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1hSrZzA3YHHeNWodSyhbjzoQM_fyFfiWpg0sbTmLocACbO-sN0rFbFqATfTYa_VlCCfOOYWR6UiBgpTxWcq9BVczIHuu-vipfq5Atenn2EPgty-NhkObvGYysXmUNS_HYOpJECkEaE_BHGrkMS_vzPc1qUczRQsySiZlaNp8GEBQEW751ytTXi7qEXfcPcmg1OGzY0mJrUM7u-U8Bxp3RtA6QCQ2iMUOfdEoV77vN5BxaZE28awdcRfoqzEJd3H3hjM'}
                    alt="Order"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-black text-[#1a237e]">
                      #{order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        order.status === 'नया ऑर्डर'
                          ? 'bg-[#ffdad6] text-[#ba1a1a] animate-pulse'
                          : order.status === 'प्रगति पर'
                          ? 'bg-[#ffddb8] text-[#d48700]'
                          : order.status === 'पूर्ण'
                          ? 'bg-[#a3f69c] text-[#002204]'
                          : 'bg-[#e0e0ff] text-[#1a237e]'
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.type === 'creative' && (
                      <span className="text-[10px] font-semibold bg-[#e0e0ff] text-[#1a237e] px-2 py-0.5 rounded-md">
                        पोस्टर डिज़ाइन
                      </span>
                    )}
                    <span className="text-[11px] text-[#767683]">{order.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#181c21] truncate">
                    {order.title}
                  </h3>

                  {/* Customer specifics */}
                  <div className="flex items-center gap-3 text-xs text-[#454652] mt-1.5 flex-wrap">
                    <div className="flex items-center gap-1 font-semibold text-[#181c21]">
                      <span className="material-symbols-outlined text-[15px] text-[#767683]">person</span>
                      <span>{order.customerName || 'अतिथि'}</span>
                    </div>

                    {order.whatsappNumber && (
                      <div className="flex items-center gap-1 text-[#1b6d24] font-bold">
                        <span className="material-symbols-outlined text-[15px]">chat</span>
                        <span>+91 {order.whatsappNumber}</span>
                      </div>
                    )}

                    {order.city && (
                      <div className="flex items-center gap-1 text-[#767683]">
                        <span className="material-symbols-outlined text-[15px]">location_on</span>
                        <span>{order.city}</span>
                      </div>
                    )}

                    {/* Voice note indicator */}
                    {order.voiceNoteAudioUrl && (
                      <span className="text-[10px] font-bold bg-[#1a237e] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">mic</span>
                        वॉइस नोट उपलब्ध
                      </span>
                    )}

                    {/* Uploaded images indicator */}
                    {order.uploadedImages && order.uploadedImages.length > 0 && (
                      <span className="text-[10px] font-bold bg-[#a3f69c] text-[#002204] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">image</span>
                        {order.uploadedImages.length} फ़ोटो अपलोड
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Actions Right */}
              <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#f1f4fb]">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-[#767683] block">कुल राशि</span>
                  <span className="text-base font-extrabold text-[#1a237e]">₹{order.total}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* WhatsApp Quick Chat */}
                  {order.whatsappNumber && (
                    <a
                      href={`https://wa.me/91${order.whatsappNumber}?text=${encodeURIComponent(
                        `नमस्ते ${order.customerName || ''}! मैं Zenith Studio से आपके ऑर्डर #${order.orderNumber} के सम्बंध में बात कर रहा हूँ।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-[#a3f69c]/40 hover:bg-[#a3f69c] text-[#002204] rounded-xl text-xs font-bold flex items-center justify-center transition-colors"
                      title="ग्राहक को WhatsApp भेजें"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </a>
                  )}

                  {/* View Full Details Button */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-[#1a237e] hover:bg-[#000666] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>पूरा विवरण देखें</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="p-2 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-xl transition-colors"
                    title="ऑर्डर हटाएं"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* DETAILED INSPECTION MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#dfe2e9] my-auto animate-in zoom-in-95 flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-[#1a237e] text-white p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">assignment</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    ऑर्डर विवरण: #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-[11px] text-[#8690ee]">
                    {selectedOrder.title} • {selectedOrder.date}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 flex flex-col gap-5">
              
              {/* Customer Contact Card */}
              <div className="bg-[#f7f9ff] p-4 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
                <h4 className="text-xs font-bold text-[#1a237e] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <span>ग्राहक संपर्क विवरण</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#767683] block">ग्राहक का नाम:</span>
                    <span className="font-bold text-[#181c21] text-sm">
                      {selectedOrder.customerName || 'अतिथि ग्राहक'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#767683] block">WhatsApp मोबाइल नंबर:</span>
                    <span className="font-bold text-[#1b6d24] text-sm">
                      +91 {selectedOrder.whatsappNumber || 'उपलब्ध नहीं'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#767683] block">शहर / स्थान:</span>
                    <span className="font-semibold text-[#181c21]">
                      {selectedOrder.city || 'देहरादून'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#767683] block">डिलीवरी पता / मोड:</span>
                    <span className="font-semibold text-[#181c21]">
                      {selectedOrder.deliveryAddress}
                    </span>
                  </div>
                </div>

                {selectedOrder.whatsappNumber && (
                  <div className="pt-2 border-t border-[#dfe2e9]">
                    <a
                      href={`https://wa.me/91${selectedOrder.whatsappNumber}?text=${encodeURIComponent(
                        `नमस्ते ${selectedOrder.customerName || ''}! Zenith Studio की ओर से आपका ऑर्डर #${selectedOrder.orderNumber} प्राप्त हो गया है। हम आपका पोस्टर तैयार कर रहे हैं।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1b6d24] hover:bg-[#155a1d] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      <span>WhatsApp पर ग्राहक से सीधे चैट करें</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Poster Design Specifications */}
              {selectedOrder.type === 'creative' && (
                <div className="bg-[#f7f9ff] p-4 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-[#1a237e] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">palette</span>
                    <span>पोस्टर की आवश्यकताएं व विवरण</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#767683] block">पोस्टर श्रेणी:</span>
                      <span className="font-semibold text-[#181c21]">
                        {selectedOrder.posterCategory || 'सामान्य'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#767683] block">साइज़ / अनुपात:</span>
                      <span className="font-semibold text-[#181c21]">
                        {selectedOrder.posterSize || '1:1 स्क्वायर'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#767683] block">भाषा प्राथमिकता:</span>
                      <span className="font-semibold text-[#181c21]">
                        {selectedOrder.languagePreference || 'हिंदी व अंग्रेज़ी'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#767683] block">डिलीवरी गति:</span>
                      <span className="font-bold text-[#1b6d24]">
                        {selectedOrder.turnaroundSpeed || 'एक्सप्रेस (4 घंटे)'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Text Requirements */}
                  <div className="mt-1 bg-white p-3 rounded-xl border border-[#dfe2e9]">
                    <span className="text-[11px] font-bold text-[#767683] block mb-1">
                      ग्राहक का लिखित विवरण (पोस्टर में क्या लिखना है):
                    </span>
                    <p className="text-xs text-[#181c21] whitespace-pre-wrap leading-relaxed">
                      {selectedOrder.requirementsText || 'कोई लिखित विवरण नहीं दिया गया (वॉइस नोट सुनें)।'}
                    </p>
                  </div>
                </div>
              )}

              {/* Customer Voice Note Player */}
              {selectedOrder.voiceNoteAudioUrl && (
                <div className="bg-[#f0f4ff] p-4 rounded-2xl border border-[#c4d0f5] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1a237e] text-[22px]">mic</span>
                      <h4 className="text-xs font-bold text-[#1a237e]">
                        ग्राहक का वॉयस नोट (Voice Note)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold bg-[#1a237e] text-white px-2 py-0.5 rounded-full">
                      ऑडियो उपलब्ध
                    </span>
                  </div>

                  <p className="text-[11px] text-[#454652]">
                    ग्राहक ने बोलकर यह निर्देश रिकॉर्ड किए हैं। नीचे दिए प्लेयर से सुनें:
                  </p>

                  <div className="bg-white p-3 rounded-xl border border-[#c4d0f5] flex items-center gap-3">
                    <audio
                      controls
                      src={selectedOrder.voiceNoteAudioUrl}
                      className="w-full h-10"
                    />
                  </div>
                </div>
              )}

              {/* Uploaded Photos / Logos Gallery */}
              {selectedOrder.uploadedImages && selectedOrder.uploadedImages.length > 0 && (
                <div className="bg-[#f7f9ff] p-4 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#1a237e] text-[20px]">photo_library</span>
                      <h4 className="text-xs font-bold text-[#1a237e] uppercase tracking-wider">
                        ग्राहक द्वारा अपलोड की गई तस्वीरें व लोगो ({selectedOrder.uploadedImages.length})
                      </h4>
                    </div>
                    <span className="text-[11px] text-[#767683]">बड़ा देखने के लिए क्लिक करें</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selectedOrder.uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(img)}
                        className="relative h-28 rounded-xl overflow-hidden border border-[#dfe2e9] bg-white cursor-pointer hover:opacity-90 transition-opacity shadow-xs group"
                      >
                        <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update & Admin Notes Panel */}
              <div className="bg-[#f7f9ff] p-4 rounded-2xl border border-[#dfe2e9] flex flex-col gap-3">
                <h4 className="text-xs font-bold text-[#1a237e] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  <span>ऑर्डर स्थिति और एडमिन नोट्स</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#454652] block mb-1">
                      स्थिति बदलें (Order Status):
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-white border border-[#dfe2e9] rounded-xl px-3 py-2 text-xs font-semibold text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                    >
                      <option value="नया ऑर्डर">नया ऑर्डर (New Order)</option>
                      <option value="प्रगति पर">प्रगति पर (In Progress / Designing)</option>
                      <option value="प्रूफ़ तैयार">प्रूफ़ तैयार (Proof Ready on WhatsApp)</option>
                      <option value="पूर्ण">पूर्ण (Completed & Delivered)</option>
                      <option value="रद्द">रद्द (Cancelled)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#454652] block mb-1">
                      एडमिन / डिज़ाइनर नोट्स:
                    </label>
                    <input
                      type="text"
                      value={newAdminNotes}
                      onChange={(e) => setNewAdminNotes(e.target.value)}
                      placeholder="उदा. डिज़ाइनर अमित को सौंपा गया, प्रूफ़ भेजा गया"
                      className="w-full bg-white border border-[#dfe2e9] rounded-xl px-3 py-2 text-xs text-[#181c21] focus:outline-none focus:border-[#1a237e]"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <span className="text-[#767683]">कुल मूल्य: </span>
                    <span className="font-extrabold text-[#1a237e] text-base">₹{selectedOrder.total}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveStatus}
                    disabled={isUpdating}
                    className="bg-[#1a237e] hover:bg-[#000666] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                  >
                    {isUpdating ? (
                      <span>सेव हो रहा है...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        <span>डेटाबेस में सेव करें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] p-2 bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center shadow-md transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <img
              src={lightboxImage}
              alt="Full view"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

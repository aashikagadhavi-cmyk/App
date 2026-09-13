import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ServicesView } from './components/ServicesView';
import { StoreView } from './components/StoreView';
import { SpecialistsView } from './components/SpecialistsView';
import { OrdersView } from './components/OrdersView';
import { ProfileView } from './components/ProfileView';
import { AdminView } from './components/AdminView';
import { CartDrawer } from './components/CartDrawer';
import { CreativeBookingModal } from './components/CreativeBookingModal';
import { ProductModal } from './components/ProductModal';
import { ServiceModal } from './components/ServiceModal';
import { LocationModal } from './components/LocationModal';
import { FilterModal } from './components/FilterModal';

import { ORGANIC_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { AppTab, CartItem, ProductItem, ServiceItem, Specialist, OrderItem } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('services');
  const [selectedCity, setSelectedCity] = useState<string>('देहरादून / दिल्ली NCR');

  // Initial cart
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: ORGANIC_PRODUCTS[0],
      quantity: 1
    }
  ]);

  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // Modal states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCreativeBookingOpen, setIsCreativeBookingOpen] = useState(false);
  const [serviceForBooking, setServiceForBooking] = useState<ServiceItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch orders from Express backend API
  const refreshOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      }
    } catch (err) {
      console.warn('Could not sync with backend /api/orders, using local state:', err);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  // Cart operations
  const handleAddToCart = (product: ProductItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    showToast(`${product.name} टोकरी में जोड़ा गया!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutComplete = async (total: number, address: string) => {
    const orderNumber = `ZH-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsTitle = cart.map(i => i.product.name).join(', ');

    const orderPayload = {
      type: 'organic',
      title: itemsTitle,
      customerName: 'अंकिता नेगी',
      whatsappNumber: '9412098765',
      city: selectedCity,
      total,
      itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0),
      deliveryAddress: address,
      eta: `आज शाम 5:30 तक (${selectedCity})`,
      imageThumbnail: cart[0]?.product.imageUrl || ORGANIC_PRODUCTS[0].imageUrl
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => [data.order, ...prev]);
      } else {
        throw new Error('API failed');
      }
    } catch {
      const fallbackOrder: OrderItem = {
        id: `ord-${Date.now()}`,
        orderNumber,
        type: 'organic',
        title: itemsTitle,
        date: 'आज, अभी',
        timestamp: Date.now(),
        status: 'प्रगति पर',
        total,
        itemsCount: cart.reduce((sum, i) => sum + i.quantity, 0),
        deliveryAddress: address,
        eta: `आज शाम 5:30 तक (${selectedCity})`,
        imageThumbnail: cart[0]?.product.imageUrl || ORGANIC_PRODUCTS[0].imageUrl
      };
      setOrders(prev => [fallbackOrder, ...prev]);
    }

    showToast('ऑर्डर कन्फर्म हुआ! कोल्ड-चेन पहाड़ी एक्सप्रेस से भेजा जा रहा है।');
  };

  // Service booking opens detailed CreativeBookingModal
  const handleOpenBookingModal = (service?: ServiceItem) => {
    setServiceForBooking(service || null);
    setIsCreativeBookingOpen(true);
  };

  const handleOrderCreated = (newOrder: OrderItem) => {
    setOrders(prev => {
      const exists = prev.some(o => o.id === newOrder.id);
      if (exists) return prev;
      return [newOrder, ...prev];
    });
    showToast(`ऑर्डर #${newOrder.orderNumber} सफलतापूर्वक दर्ज हो गया!`);
    refreshOrders();
  };

  const handleOrderUpdated = (updatedOrder: OrderItem) => {
    setOrders(prev =>
      prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    showToast(`ऑर्डर #${updatedOrder.orderNumber} की स्थिति अपडेट हो गई!`);
  };

  const handleOrderDeleted = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('ऑर्डर सफलतापूर्वक हटा दिया गया।');
  };

  const handleBookSpecialist = async (specialist: Specialist) => {
    const orderPayload = {
      type: 'creative',
      title: `फ़ील्ड तकनीशियन सेवा: ${specialist.name} (${specialist.category})`,
      customerName: 'हिमधारा फूड्स',
      whatsappNumber: '9837012984',
      city: selectedCity,
      total: specialist.hourlyRate * 10 * 2,
      itemsCount: 1,
      deliveryAddress: `फ़ील्ड साइट - ${selectedCity}`,
      eta: `तकनीशियन 35 मिनट में पहुँचेंगे (${specialist.distance})`,
      imageThumbnail: specialist.avatarUrl
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders(prev => [data.order, ...prev]);
      }
    } catch {
      const fallback: OrderItem = {
        id: `ord-${Date.now()}`,
        orderNumber: `ZH-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'creative',
        title: `फ़ील्ड तकनीशियन: ${specialist.name}`,
        date: 'आज, अभी',
        timestamp: Date.now(),
        status: 'प्रगति पर',
        total: specialist.hourlyRate * 10 * 2,
        itemsCount: 1,
        deliveryAddress: `फ़ील्ड साइट - ${selectedCity}`,
        eta: `तकनीशियन 35 मिनट में पहुँचेंगे (${specialist.distance})`,
        imageThumbnail: specialist.avatarUrl
      };
      setOrders(prev => [fallback, ...prev]);
    }

    showToast(`विशेषज्ञ ${specialist.name} को डिस्पैच अनुरोध भेज दिया गया!`);
    setCurrentTab('orders');
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#181c21] flex flex-col items-center justify-start selection:bg-[#1a237e] selection:text-white relative">
      
      {/* Fixed Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedCity={selectedCity}
        onOpenLocationModal={() => setIsLocationOpen(true)}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 z-50 px-4 pointer-events-none w-full max-w-md animate-in slide-in-from-top-3 duration-300">
          <div className="bg-[#000666] text-white px-4 py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,6,102,0.35)] flex items-center justify-between gap-2 border border-[#8690ee]/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#a0f399] text-[20px]">check_circle</span>
              <span className="text-xs font-semibold">{toastMessage}</span>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="pointer-events-auto text-white/70 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Responsive container */}
      <main className={`w-full min-h-screen flex flex-col pt-16 bg-[#f7f9ff] ${
        currentTab === 'admin' ? 'max-w-6xl px-3 sm:px-6' : 'max-w-md'
      }`}>
        {currentTab === 'services' && (
          <ServicesView
            onSelectService={(service) => setSelectedService(service)}
            onOpenQuoteModal={() => handleOpenBookingModal()}
            onOpenFilterModal={() => setIsFilterOpen(true)}
            onTabChange={setCurrentTab}
          />
        )}

        {currentTab === 'naturals' && (
          <StoreView
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenCart={() => setIsCartOpen(true)}
            onSelectProduct={(product) => setSelectedProduct(product)}
            selectedCity={selectedCity}
            onOpenLocationModal={() => setIsLocationOpen(true)}
          />
        )}

        {currentTab === 'specialists' && (
          <SpecialistsView
            onBookSpecialist={handleBookSpecialist}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            onOpenStore={() => setCurrentTab('naturals')}
          />
        )}

        {currentTab === 'admin' && (
          <div className="pt-2">
            <AdminView
              orders={orders}
              onOrderUpdated={handleOrderUpdated}
              onOrderDeleted={handleOrderDeleted}
              onRefreshOrders={refreshOrders}
            />
          </div>
        )}

        {currentTab === 'profile' && (
          <ProfileView
            selectedCity={selectedCity}
            onOpenLocationModal={() => setIsLocationOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={cartTotalItems}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onCheckoutComplete={handleCheckoutComplete}
        selectedCity={selectedCity}
      />

      {/* Detailed Poster & Creative Booking Modal */}
      <CreativeBookingModal
        isOpen={isCreativeBookingOpen}
        onClose={() => setIsCreativeBookingOpen(false)}
        service={serviceForBooking}
        selectedCity={selectedCity}
        onOrderCreated={handleOrderCreated}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        quantityInCart={selectedProduct ? (cart.find(i => i.product.id === selectedProduct.id)?.quantity || 0) : 0}
        onUpdateQuantity={handleUpdateQuantity}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={(service) => handleOpenBookingModal(service)}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={({ maxPrice, expressOnly }) => {
          showToast(`फ़िल्टर लागू: अधिकतम ₹${maxPrice}${expressOnly ? ', केवल 4 घंटे एक्सप्रेस' : ''}`);
        }}
      />

    </div>
  );
}

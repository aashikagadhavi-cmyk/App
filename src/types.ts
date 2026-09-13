export type AppTab = 'services' | 'naturals' | 'specialists' | 'orders' | 'admin' | 'profile';

export interface ServiceItem {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  description: string;
  price: number;
  icon: string;
  badge?: string;
  bgColor: string;
  accentColor: string;
  iconColor: string;
  deliveryTime: string;
  deliverables: string[];
  revisions: string;
}

export interface ProductItem {
  id: string;
  name: string;
  nameHi?: string;
  subtitle: string;
  category: 'Pure Ghee' | 'Wild Honey' | 'Pahadi Millets' | 'Organic Pulses' | 'Artisanal Spices';
  categoryHi: string;
  price: number;
  originalPrice: number;
  weight: string;
  rating: number;
  reviewsCount: number;
  stockStatus: 'In Stock' | 'Limited Harvest';
  harvestAltitude: string;
  origin: string;
  imageUrl: string;
  tag: string;
  tagColor: string;
  description: string;
  benefits: string[];
  farmerGroup: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface Specialist {
  id: string;
  name: string;
  hourlyRate: number;
  rating: number;
  category: string;
  categoryHi: string;
  avatarUrl: string;
  isTopRated: boolean;
  distance: string;
  status: 'Available Now' | 'In Job' | 'En Route';
  skills: string[];
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  type: 'organic' | 'creative';
  title: string;
  date: string;
  timestamp: number;
  status: 'नया ऑर्डर' | 'प्रगति पर' | 'प्रूफ़ तैयार' | 'पूर्ण' | 'रद्द' | string;
  total: number;
  itemsCount: number;
  deliveryAddress: string;
  eta: string;
  imageThumbnail: string;

  // Detailed Creative / Poster specifications
  customerName?: string;
  whatsappNumber?: string;
  city?: string;
  posterCategory?: string;
  posterSize?: string;
  languagePreference?: string;
  requirementsText?: string;
  voiceNoteAudioUrl?: string;
  voiceNoteDuration?: number;
  uploadedImages?: string[];
  turnaroundSpeed?: string;
  includeSourceFiles?: boolean;
  adminNotes?: string;
}


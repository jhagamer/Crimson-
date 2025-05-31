
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[]; // Changed from imageUrl to imageUrls
  stock: number;
  category: string;
  brand?: string;
  tag?: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
}

export interface CartItemType extends Product {
  quantity: number;
}

export interface Order {
  id:string;
  items: CartItemType[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: Address;
  createdAt: string;
  trackingNumber?: string;
  isPhoneConfirmed?: boolean;
}

export interface Address {
  fullName?: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  apartment?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'delivery'; // 'delivery' can be 'worker'
  address?: Address;
  username?: string; // For staff login
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string; // Categories can still use a single image
  link: string;
  dataAiHint: string;
  bgColorClass?: string;
}

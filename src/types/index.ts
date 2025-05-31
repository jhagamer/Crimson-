
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
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
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'delivery';
  address?: Address;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  link: string;
  dataAiHint: string;
  bgColorClass?: string; // For styling category cards like in the image
}

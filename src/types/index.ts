export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  brand?: string; // New: Product brand or maker
  tag?: string; // New: e.g., "Best Seller", "New", "Save X NRS"
  originalPrice?: number; // New: For displaying a strikethrough price
  rating?: number; // New: Average star rating (e.g., 4.5)
  reviewCount?: number; // New: Number of reviews
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

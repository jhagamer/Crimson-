
import type { Product, Order, Category, Address } from '@/types';

const defaultMockAddress: Address = {
  fullName: 'Mock User',
  phone: '+11234567890',
  street: '123 Mockingbird Lane',
  city: 'Mockville',
  state: 'MS',
  zipCode: '12345',
  country: 'Mockland',
  apartment: 'Apt 1'
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Radiant Glow Serum',
    description: 'A potent vitamin C serum to brighten and even out skin tone, leaving your skin with a radiant glow.',
    price: 3599,
    originalPrice: 4799,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 35,
    category: 'Skincare',
    brand: 'Glow Beauty',
    tag: 'Save NRS 1200',
    rating: 4.8,
    reviewCount: 234,
  },
  {
    id: '2',
    name: 'Velvet Matte Foundation',
    description: 'Full-coverage foundation with a velvety matte finish that lasts all day without caking.',
    price: 3850,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 25,
    category: 'Makeup',
    brand: 'CoverLuxe',
    rating: 4.5,
    reviewCount: 189,
    tag: "New"
  },
  {
    id: '3',
    name: 'Crimson Kiss Lipstick Set',
    description: 'A luxurious, highly pigmented lipstick in our signature crimson shade with a satin finish.',
    price: 4199,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 50,
    category: 'Makeup',
    brand: 'Color Pop',
    rating: 4.9,
    reviewCount: 456,
  },
  {
    id: '4',
    name: 'Hydrating Hair Masque',
    description: 'Deeply conditioning hair masque to restore moisture and shine to dry, damaged hair.',
    price: 3200,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 30,
    category: 'Haircare',
    brand: 'Silken Strands',
    rating: 4.6,
    reviewCount: 120,
    tag: 'Premium'
  },
  {
    id: '5',
    name: 'Midnight Bloom Perfume',
    description: 'An enchanting floral perfume with notes of jasmine, tuberose, and sandalwood for a captivating scent.',
    price: 7500,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 22,
    category: 'Fragrance',
    brand: 'Mystique Scents',
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: '6',
    name: 'Gentle Cleansing Foam',
    description: 'A soothing micellar water that effectively removes makeup and impurities without stripping the skin.',
    price: 2279,
    originalPrice: 2759,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 40,
    category: 'Skincare',
    brand: 'Clean & Co',
    tag: 'Save NRS 480',
    rating: 4.5,
    reviewCount: 123,
  },
   {
    id: '7',
    name: 'Anti-Aging Eye Cream',
    description: 'Revitalizing eye cream to reduce dark circles and fine lines.',
    price: 5519,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 15,
    category: 'Skincare',
    brand: 'Youth Labs',
    rating: 4.7,
    reviewCount: 89,
    tag: "Premium"
  },
  {
    id: '8',
    name: 'Illuminating Highlighter',
    description: 'A powder highlighter for a radiant, buildable glow.',
    price: 2759,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 60,
    category: 'Makeup',
    brand: 'Radiant Beauty',
    rating: 4.8,
    reviewCount: 167,
  }
];

export const mockOrderHistory: Order[] = [
  {
    id: 'HIST_ORD001',
    status: 'Delivered',
    totalAmount: mockProducts[0].price + mockProducts[2].price + 50,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{...mockProducts[0], quantity: 1}, {...mockProducts[2], quantity: 1}],
    shippingAddress: { ...defaultMockAddress, street: '123 Old St', city: 'Pastville', fullName: 'Historic User', phone: '+1000000001'},
    trackingNumber: 'TRACKHIST001',
    isPhoneConfirmed: true,
  },
  {
    id: 'HIST_ORD002',
    status: 'Shipped',
    totalAmount: mockProducts[1].price * 2 + 50,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{...mockProducts[1], quantity: 2}],
    shippingAddress: { ...defaultMockAddress, street: '456 Past Ln', city: 'Memorytown', fullName: 'Recent User', phone: '+1000000002'},
    trackingNumber: 'TRACKHIST002',
    isPhoneConfirmed: false,
  },
];

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Skincare',
    imageUrl: 'https://placehold.co/300x300.png/FFC0CB/333333', // Pinkish background
    link: '/search?category=skincare',
    dataAiHint: 'skincare products',
    bgColorClass: 'bg-pink-200/50',
  },
  {
    id: 'cat2',
    name: 'Makeup',
    imageUrl: 'https://placehold.co/300x300.png/E6E6FA/333333', // Lavenderish background
    link: '/search?category=makeup',
    dataAiHint: 'makeup items',
    bgColorClass: 'bg-purple-200/50',
  },
  {
    id: 'cat3',
    name: 'Fragrance',
    imageUrl: 'https://placehold.co/300x300.png/FFB6C1/333333', // LightPink background
    link: '/search?category=fragrance',
    dataAiHint: 'perfume bottle',
    bgColorClass: 'bg-rose-200/50',
  },
  {
    id: 'cat4',
    name: 'Hair Care',
    imageUrl: 'https://placehold.co/300x300.png/D8BFD8/333333', // Thistle background
    link: '/search?category=haircare',
    dataAiHint: 'haircare products',
    bgColorClass: 'bg-fuchsia-200/50',
  },
   {
    id: 'cat5',
    name: 'Body Care',
    imageUrl: 'https://placehold.co/300x300.png/FFE4E1/333333', // MistyRose background
    link: '/search?category=bodycare',
    dataAiHint: 'body lotion spa',
    bgColorClass: 'bg-pink-100/50',
  },
];

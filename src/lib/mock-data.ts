
import type { Product, Order } from '@/types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Radiant Glow Serum',
    description: 'A potent vitamin C serum to brighten and even out skin tone, leaving your skin with a radiant glow.',
    price: 45.00,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 35,
    category: 'Skincare',
  },
  {
    id: '2',
    name: 'Velvet Matte Foundation',
    description: 'Full-coverage foundation with a velvety matte finish that lasts all day without caking.',
    price: 38.50,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 25,
    category: 'Makeup',
  },
  {
    id: '3',
    name: 'Crimson Kiss Lipstick',
    description: 'A luxurious, highly pigmented lipstick in our signature crimson shade with a satin finish.',
    price: 22.99,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 50,
    category: 'Makeup',
  },
  {
    id: '4',
    name: 'Hydrating Hair Masque',
    description: 'Deeply conditioning hair masque to restore moisture and shine to dry, damaged hair.',
    price: 32.00,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 30,
    category: 'Haircare',
  },
  {
    id: '5',
    name: 'Midnight Bloom Perfume',
    description: 'An enchanting floral perfume with notes of jasmine, tuberose, and sandalwood for a captivating scent.',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 22,
    category: 'Fragrance',
  },
  {
    id: '6',
    name: 'Gentle Micellar Water',
    description: 'A soothing micellar water that effectively removes makeup and impurities without stripping the skin.',
    price: 18.99,
    imageUrl: 'https://placehold.co/600x400.png',
    stock: 40,
    category: 'Skincare',
  },
];

export const mockOrderHistory: Order[] = [
  { 
    id: 'HIST_ORD001', 
    status: 'Delivered', 
    totalAmount: 120.50, 
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
    items: [{...mockProducts[0], quantity: 1}, {...mockProducts[2], quantity: 1}],
    shippingAddress: { street: '123 Old St', city: 'Pastville', state: 'OS', zipCode: '00001', country: 'Old Country'},
    trackingNumber: 'TRACKHIST001'
  },
  { 
    id: 'HIST_ORD002', 
    status: 'Shipped', 
    totalAmount: 75.00, 
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    items: [{...mockProducts[1], quantity: 2}],
    shippingAddress: { street: '456 Past Ln', city: 'Memorytown', state: 'ML', zipCode: '00002', country: 'Old Country'},
    trackingNumber: 'TRACKHIST002'
  },
];

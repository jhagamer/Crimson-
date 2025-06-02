
'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// import { mockProducts } from '@/lib/mock-data'; // Will fetch from Supabase
import { PlusCircle, Edit, Trash2, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import NextImage from 'next/image'; 
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product> & { imageUrlsInput?: string }>({});
  const { toast } = useToast();

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    if (!supabase) {
      setError("Supabase client is not available.");
      setIsLoading(false);
      return;
    }
    const { data, error: fetchError } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (fetchError) {
      console.error("Error fetching products:", fetchError);
      setError(`Failed to load products: ${fetchError.message}`);
      setProducts([]);
    } else {
      setProducts(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ 
        ...prev, 
        [name]: (name === 'price' || name === 'stock' || name === 'originalPrice' || name === 'rating' || name === 'reviewCount') 
                ? parseFloat(value) || (name === 'rating' || name === 'reviewCount' ? undefined : 0) // Handle undefined for optional numbers
                : value 
    }));
  };

  const handleImageUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductForm(prev => ({ ...prev, imageUrlsInput: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast({ title: "Error", description: "Supabase client not available.", variant: "destructive" });
      return;
    }

    const imageUrlsArray = productForm.imageUrlsInput?.split(',').map(url => url.trim()).filter(url => url) || [];
    const productDataToSave = {
      name: productForm.name || 'Unnamed Product',
      description: productForm.description || '',
      price: productForm.price || 0,
      imageUrls: imageUrlsArray.length > 0 ? imageUrlsArray : ['https://placehold.co/600x400.png'],
      stock: productForm.stock || 0,
      category: productForm.category || 'Uncategorized',
      brand: productForm.brand || undefined,
      tag: productForm.tag || undefined,
      originalPrice: productForm.originalPrice || undefined,
      rating: productForm.rating || undefined,
      reviewCount: productForm.reviewCount || undefined,
    };
    
    if (editingProduct) {
      const { data, error: updateError } = await supabase
        .from('products')
        .update({ ...productDataToSave, id: editingProduct.id }) // Ensure id is part of update if needed, or omit
        .eq('id', editingProduct.id);

      if (updateError) {
        toast({ title: "Update Failed", description: updateError.message, variant: "destructive" });
      } else {
        toast({ title: "Product Updated", description: `${productDataToSave.name} updated successfully.` });
        fetchProducts(); // Re-fetch to update list
      }
    } else {
      // For new products, Supabase typically generates the ID if it's a primary key
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([productDataToSave]);
      
      if (insertError) {
        toast({ title: "Add Failed", description: insertError.message, variant: "destructive" });
      } else {
        toast({ title: "Product Added", description: `${productDataToSave.name} added successfully.` });
        fetchProducts(); // Re-fetch to update list
      }
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setProductForm({});
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({imageUrlsInput: 'https://placehold.co/600x400.png', name: '', description: '', price: 0, stock: 0, category: ''});
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm({...product, imageUrlsInput: product.imageUrls.join(', ')});
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!supabase) {
      toast({ title: "Error", description: "Supabase client not available.", variant: "destructive" });
      return;
    }
    const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);
    if (deleteError) {
      toast({ title: "Delete Failed", description: deleteError.message, variant: "destructive" });
    } else {
      toast({ title: "Product Deleted", description: "Product removed successfully." });
      fetchProducts(); // Re-fetch products
    }
  };

  if (isLoading && products.length === 0) { // Show skeletons only on initial load
    return (
      <div className="container mx-auto py-8">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </CardHeader>
          <CardContent>
            {[...Array(3)].map((_, i) => (
              <TableRow key={i} className="border-b-0">
                <TableCell className="w-[80px]"><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                <TableCell className="text-center space-x-2">
                  <Skeleton className="h-8 w-8 inline-block" /> <Skeleton className="h-8 w-8 inline-block" />
                </TableCell>
              </TableRow>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card className="shadow-xl p-8 inline-block">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <CardTitle className="text-2xl text-destructive mb-2">Error Loading Products</CardTitle>
          <CardDescription>{error}</CardDescription>
          <Button onClick={fetchProducts} className="mt-6">Try Again</Button>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold text-primary">Manage Products</CardTitle>
            <CardDescription>Add, edit, or delete cosmetic products in your store. (Connected to Supabase)</CardDescription>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-secondary/20"> {/* Added background for letterboxing */}
                      <NextImage src={product.imageUrls[0]} alt={product.name} layout="fill" objectFit="contain" data-ai-hint={`${product.category.toLowerCase()} product small`} /> {/* Changed to contain */}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell className="text-right">NRS {product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right" >{product.stock}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(product)} className="mr-2 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(product.id)} className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {products.length === 0 && !isLoading && <p className="text-center text-muted-foreground py-8">No products found in the database. Add your first cosmetic product!</p>}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update the details of this cosmetic product.' : 'Fill in the details for the new cosmetic product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" name="name" value={productForm.name || ''} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" value={productForm.description || ''} onChange={handleInputChange} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Input id="category" name="category" value={productForm.category || ''} onChange={handleInputChange} className="col-span-3" placeholder="e.g., Skincare, Makeup" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand" className="text-right">Brand</Label>
              <Input id="brand" name="brand" value={productForm.brand || ''} onChange={handleInputChange} className="col-span-3" placeholder="e.g., Glow Beauty"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (NRS)</Label>
              <Input id="price" name="price" type="number" step="0.01" value={productForm.price === undefined ? '' : productForm.price} onChange={handleInputChange} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="originalPrice" className="text-right">Original Price</Label>
              <Input id="originalPrice" name="originalPrice" type="number" step="0.01" value={productForm.originalPrice === undefined ? '' : productForm.originalPrice} onChange={handleInputChange} className="col-span-3" placeholder="Optional"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock</Label>
              <Input id="stock" name="stock" type="number" value={productForm.stock === undefined ? '' : productForm.stock} onChange={handleInputChange} className="col-span-3" required />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tag" className="text-right">Tag/Badge</Label>
              <Input id="tag" name="tag" value={productForm.tag || ''} onChange={handleInputChange} className="col-span-3" placeholder="e.g., New, Sale, Save NRS X"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">Rating</Label>
              <Input id="rating" name="rating" type="number" step="0.1" max="5" min="0" value={productForm.rating === undefined ? '' : productForm.rating} onChange={handleInputChange} className="col-span-3" placeholder="e.g., 4.5"/>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reviewCount" className="text-right">Review Count</Label>
              <Input id="reviewCount" name="reviewCount" type="number" value={productForm.reviewCount === undefined ? '' : productForm.reviewCount} onChange={handleInputChange} className="col-span-3" placeholder="e.g., 150"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrlsInput" className="text-right">Image URLs</Label>
              <Input id="imageUrlsInput" name="imageUrlsInput" value={productForm.imageUrlsInput || ''} onChange={handleImageUrlsChange} className="col-span-3" placeholder="Comma-separated URLs" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right col-span-1">Image Upload</Label>
              <div className="col-span-3">
                <Input type="file" multiple disabled className="text-sm"/>
                <p className="text-xs text-muted-foreground mt-1">Image upload via Supabase Storage needs to be implemented for product forms.</p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

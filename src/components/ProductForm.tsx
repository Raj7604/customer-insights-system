'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product, storage, formatIndianCurrency } from '@/lib/data';
import { Package, X } from 'lucide-react';

interface ProductFormProps {
  onProductAdded: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    tag: 'medium' as 'high' | 'medium' | 'low',
    reason: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 
    'Sports', 'Toys', 'Beauty', 'Food'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.price || Number(formData.price) < 1) newErrors.price = 'Price must be at least ₹1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      description: `High-quality ${formData.name.toLowerCase()} with premium features`,
      tag: formData.tag,
      reason: formData.reason.trim()
    };

    // Store in localStorage
    const existingProducts = storage.getProducts();
    storage.setProducts([...existingProducts, newProduct]);

    // Notify parent
    onProductAdded(newProduct);

    // Reset form
    setFormData({
      name: '',
      category: '',
      price: '',
      tag: 'medium',
      reason: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getTagColor = (tag: 'high' | 'medium' | 'low') => {
    switch (tag) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Add New Product
        </CardTitle>
        <CardDescription>
          Add a new product to the system. It will appear in recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Wireless Earbuds"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (₹) *</label>
              <input
                type="number"
                min="1"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 2999"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              {formData.price && !errors.price && (
                <p className="text-green-600 text-xs mt-1">
                  Formatted: {formatIndianCurrency(Number(formData.price))}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confidence Tag</label>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as const).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleInputChange('tag', tag)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.tag === tag
                        ? getTagColor(tag)
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason (Optional)</label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="e.g., Popular during festive season, high margin product, etc."
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Package className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;

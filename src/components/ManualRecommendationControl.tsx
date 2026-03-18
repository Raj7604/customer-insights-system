'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product, Customer, ManualRecommendation, storage, formatIndianCurrency } from '@/lib/data';
import { Target, Plus, X } from 'lucide-react';

interface ManualRecommendationControlProps {
  onRecommendationAdded: (recommendation: ManualRecommendation) => void;
  products: Product[];
  customers: Customer[];
}

const ManualRecommendationControl: React.FC<ManualRecommendationControlProps> = ({
  onRecommendationAdded,
  products,
  customers
}) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [confidence, setConfidence] = useState<'high' | 'medium' | 'low'>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0].id);
    }
  }, [products, selectedProduct]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedProduct) newErrors.product = 'Please select a product';
    if (selectedCustomers.length === 0) newErrors.customers = 'Please select at least one customer';
    if (!reason.trim()) newErrors.reason = 'Reason is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newRecommendation: ManualRecommendation = {
      id: `manual_rec_${Date.now()}`,
      product,
      targetCustomers: selectedCustomers,
      reason: reason.trim(),
      confidence,
      isManual: true
    };

    // Store in localStorage
    const existingRecommendations = storage.getManualRecommendations();
    storage.setManualRecommendations([...existingRecommendations, newRecommendation]);

    // Notify parent
    onRecommendationAdded(newRecommendation);

    // Reset form
    setReason('');
    setSelectedCustomers([]);
    setErrors({});
  };

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
    if (errors.customers) {
      setErrors(prev => ({ ...prev, customers: '' }));
    }
  };

  const getConfidenceColor = (conf: 'high' | 'medium' | 'low') => {
    switch (conf) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
    }
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const selectedCustomersData = customers.filter(c => selectedCustomers.includes(c.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Manual Recommendation Control
        </CardTitle>
        <CardDescription>
          Create custom product recommendations for specific customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Product *</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.product ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Choose a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - {formatIndianCurrency(product.price)}
                </option>
              ))}
            </select>
            {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}
            
            {selectedProductData && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{selectedProductData.name}</h4>
                    <p className="text-sm text-gray-600">{selectedProductData.category}</p>
                    <p className="text-sm font-medium text-green-600">
                      {formatIndianCurrency(selectedProductData.price)}
                    </p>
                  </div>
                  {selectedProductData.tag && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(selectedProductData.tag)}`}>
                      {selectedProductData.tag.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Customers *</label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {customers.length === 0 ? (
                <p className="text-gray-500 text-center py-2">No customers available</p>
              ) : (
                <div className="space-y-1">
                  {customers.map(customer => (
                    <label
                      key={customer.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCustomerToggle(customer.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{customer.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({customer.location} • {customer.totalOrders} orders)
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {errors.customers && <p className="text-red-500 text-xs mt-1">{errors.customers}</p>}
            
            {selectedCustomersData.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">
                  Selected ({selectedCustomersData.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedCustomersData.slice(0, 5).map(customer => (
                    <span
                      key={customer.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                    >
                      {customer.name}
                    </span>
                  ))}
                  {selectedCustomersData.length > 5 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                      +{selectedCustomersData.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="e.g., Perfect for frequent buyers, high margin product, seasonal item, etc."
            />
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium mb-2">Confidence Level</label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map(conf => (
                <button
                  key={conf}
                  type="button"
                  onClick={() => setConfidence(conf)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    confidence === conf
                      ? getConfidenceColor(conf)
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {conf.charAt(0).toUpperCase() + conf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Create Recommendation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualRecommendationControl;

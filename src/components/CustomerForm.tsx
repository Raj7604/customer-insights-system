'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Customer, storage, formatIndianCurrency } from '@/lib/data';
import { UserPlus, X } from 'lucide-react';

interface CustomerFormProps {
  onCustomerAdded: (customer: Customer) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    totalOrders: '',
    totalSpent: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.totalOrders || Number(formData.totalOrders) < 1) newErrors.totalOrders = 'Minimum 1 order required';
    if (!formData.totalSpent || Number(formData.totalSpent) < 1) newErrors.totalSpent = 'Minimum spend must be at least ₹1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: 25, // Default age
      location: formData.location.trim(),
      joinDate: new Date().toISOString(),
      lastPurchaseDate: new Date().toISOString(),
      totalOrders: Number(formData.totalOrders),
      totalSpent: Number(formData.totalSpent),
      segment: 'new' // New customers start as 'new' segment
    };

    // Store in localStorage
    const existingCustomers = storage.getCustomers();
    storage.setCustomers([...existingCustomers, newCustomer]);

    // Notify parent
    onCustomerAdded(newCustomer);

    // Reset form
    setFormData({
      name: '',
      email: '',
      location: '',
      totalOrders: '',
      totalSpent: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Customer
        </CardTitle>
        <CardDescription>
          Add a new customer to the system. They will appear instantly in the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Raj Sharma"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., raj.sharma@gmail.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Mumbai"
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of Orders *</label>
              <input
                type="number"
                min="1"
                value={formData.totalOrders}
                onChange={(e) => handleInputChange('totalOrders', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.totalOrders ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 5"
              />
              {errors.totalOrders && <p className="text-red-500 text-xs mt-1">{errors.totalOrders}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Total Spend (₹) *</label>
              <input
                type="number"
                min="1"
                value={formData.totalSpent}
                onChange={(e) => handleInputChange('totalSpent', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.totalSpent ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., 15000"
              />
              {errors.totalSpent && <p className="text-red-500 text-xs mt-1">{errors.totalSpent}</p>}
              {formData.totalSpent && !errors.totalSpent && (
                <p className="text-green-600 text-xs mt-1">
                  Formatted: {formatIndianCurrency(Number(formData.totalSpent))}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCustomers, getProducts, getOrders, generateInsights, formatIndianCurrency, storage, ManualRecommendation } from '@/lib/data';
import { Search, TrendingUp, Users, ShoppingCart, DollarSign, AlertTriangle, Target, Plus, Settings } from 'lucide-react';
import CustomerSegmentation from './CustomerSegmentation';
import Recommendations from './Recommendations';
import InsightsEngine from './InsightsEngine';
import SalesChart from './SalesChart';
import CustomerForm from './CustomerForm';
import ProductForm from './ProductForm';
import ManualRecommendationControl from './ManualRecommendationControl';
import ThemeToggle from './ThemeToggle';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [customers, setCustomers] = useState(getCustomers());
  const [products, setProducts] = useState(getProducts());
  const [orders, setOrders] = useState(getOrders());
  const [insights, setInsights] = useState(generateInsights(customers, orders));
  const [manualRecommendations, setManualRecommendations] = useState<ManualRecommendation[]>([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showManualRec, setShowManualRec] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load data from localStorage
    setCustomers(getCustomers());
    setProducts(getProducts());
    setOrders(getOrders());
    setInsights(generateInsights(getCustomers(), getOrders()));
    setManualRecommendations(storage.getManualRecommendations());
  }, []);

  const refreshData = () => {
    const newCustomers = getCustomers();
    const newProducts = getProducts();
    const newOrders = getOrders();
    
    setCustomers(newCustomers);
    setProducts(newProducts);
    setOrders(newOrders);
    setInsights(generateInsights(newCustomers, newOrders));
  };

  const handleCustomerAdded = (customer: any) => {
    refreshData();
  };

  const handleProductAdded = (product: any) => {
    refreshData();
  };

  const handleManualRecommendationAdded = (recommendation: ManualRecommendation) => {
    setManualRecommendations(prev => [...prev, recommendation]);
  };

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.price * order.quantity), 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const repeatCustomers = customers.filter((c: any) => c.totalOrders > 1).length;
    const newCustomers = customers.filter((c: any) => c.totalOrders === 1).length;

    return {
      totalCustomers: customers.length,
      totalRevenue,
      averageOrderValue,
      repeatCustomers,
      newCustomers
    };
  }, [customers, orders]);

  // Filter customers based on search and segment
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: any) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    });
  }, [customers, searchTerm, selectedSegment]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customer Insights Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Analyze customer data and generate actionable insights</p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <Button
            onClick={() => setShowCustomerForm(!showCustomerForm)}
            variant={showCustomerForm ? "secondary" : "default"}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
          <Button
            onClick={() => setShowProductForm(!showProductForm)}
            variant={showProductForm ? "secondary" : "default"}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
          <Button
            onClick={() => setShowManualRec(!showManualRec)}
            variant={showManualRec ? "secondary" : "default"}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Manual Rec
          </Button>
        </div>
      </div>

      {/* Forms Section */}
      {(showCustomerForm || showProductForm || showManualRec) && (
        <div className="mb-8 space-y-6">
          {showCustomerForm && (
            <CustomerForm onCustomerAdded={handleCustomerAdded} />
          )}
          {showProductForm && (
            <ProductForm onProductAdded={handleProductAdded} />
          )}
          {showManualRec && (
            <ManualRecommendationControl
              onRecommendationAdded={handleManualRecommendationAdded}
              products={products}
              customers={customers}
            />
          )}
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(metrics.totalCustomers * 0.1)}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatIndianCurrency(metrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatIndianCurrency(metrics.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">Repeat vs New</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.repeatCustomers}/{metrics.newCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((metrics.repeatCustomers / metrics.totalCustomers) * 100).toFixed(1)}% repeat rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Segments</option>
          <option value="high-value">High Value</option>
          <option value="frequent">Frequent Buyers</option>
          <option value="at-risk">At Risk</option>
          <option value="new">New Customers</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <SalesChart orders={orders} />
        
        {/* Customer Segmentation */}
        <CustomerSegmentation customers={customers} />
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <InsightsEngine insights={insights} />
        <Recommendations 
          customers={filteredCustomers.slice(0, 5)} 
          products={products} 
          orders={orders} 
          manualRecommendations={manualRecommendations}
        />
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            Showing {filteredCustomers.length} of {customers.length} customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Orders</th>
                  <th className="text-left p-2">Total Spent</th>
                  <th className="text-left p-2">Segment</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.slice(0, 10).map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 font-medium text-gray-900 dark:text-white">{customer.name}</td>
                    <td className="p-2 text-gray-600 dark:text-gray-400">{customer.email}</td>
                    <td className="p-2 text-gray-900 dark:text-white">{customer.location}</td>
                    <td className="p-2 text-gray-900 dark:text-white">{customer.totalOrders}</td>
                    <td className="p-2 text-gray-900 dark:text-white">{formatIndianCurrency(customer.totalSpent)}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.segment === 'high-value' ? 'bg-green-100 text-green-800' :
                        customer.segment === 'frequent' ? 'bg-blue-100 text-blue-800' :
                        customer.segment === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                        customer.segment === 'new' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.segment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

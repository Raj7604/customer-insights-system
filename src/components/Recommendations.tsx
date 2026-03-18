'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Customer, Product, Order, ManualRecommendation, formatIndianCurrency } from '@/lib/data';
import { Star, ShoppingCart, Users, TrendingUp } from 'lucide-react';

interface RecommendationsProps {
  customers: Customer[];
  products: Product[];
  orders: Order[];
  manualRecommendations?: ManualRecommendation[];
}

interface Recommendation {
  product: Product;
  reason: string;
  confidence: number;
  targetCustomers: string[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ customers, products, orders, manualRecommendations = [] }) => {
  // Generate product recommendations based on collaborative filtering
  const recommendations = React.useMemo((): Recommendation[] => {
    // Find frequently bought together products
    const productPairs: { [key: string]: { [key: string]: number } } = {};
    
    customers.forEach(customer => {
      const customerOrders = orders.filter(order => order.customerId === customer.id);
      const customerProducts = customerOrders.map(order => order.productId);
      
      // Find pairs of products bought together
      for (let i = 0; i < customerProducts.length; i++) {
        for (let j = i + 1; j < customerProducts.length; j++) {
          const product1 = customerProducts[i];
          const product2 = customerProducts[j];
          
          if (!productPairs[product1]) productPairs[product1] = {};
          if (!productPairs[product2]) productPairs[product2] = {};
          
          productPairs[product1][product2] = (productPairs[product1][product2] || 0) + 1;
          productPairs[product2][product1] = (productPairs[product2][product1] || 0) + 1;
        }
      }
    });

    // Generate recommendations
    const recs: Recommendation[] = [];
    const usedProducts = new Set<string>();

    Object.entries(productPairs).forEach(([productId, relatedProducts]) => {
      if (usedProducts.has(productId)) return;
      
      const mostRelated = Object.entries(relatedProducts)
        .sort(([, a], [, b]) => b - a)[0];
      
      if (mostRelated && mostRelated[1] > 2) { // Bought together more than 2 times
        const product = products.find(p => p.id === productId);
        const relatedProduct = products.find(p => p.id === mostRelated[0]);
        
        if (product && relatedProduct) {
          const targetCustomers = customers
            .filter(customer => {
              const customerOrders = orders.filter(order => order.customerId === customer.id);
              const hasProduct = customerOrders.some(order => order.productId === productId);
              const hasRelatedProduct = customerOrders.some(order => order.productId === mostRelated[0]);
              return hasProduct && !hasRelatedProduct;
            })
            .map(c => c.name)
            .slice(0, 3);

          if (targetCustomers.length > 0) {
            recs.push({
              product: relatedProduct,
              reason: `Frequently bought with "${product.name}"`,
              confidence: Math.min(mostRelated[1] / 10, 1),
              targetCustomers
            });
            usedProducts.add(relatedProduct.id);
          }
        }
      }
    });

    // Add popular product recommendations
    const productPopularity: { [key: string]: number } = {};
    orders.forEach(order => {
      productPopularity[order.productId] = (productPopularity[order.productId] || 0) + order.quantity;
    });

    const popularProducts = Object.entries(productPopularity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .filter(([productId]) => !usedProducts.has(productId));

    popularProducts.forEach(([productId, count]) => {
      const product = products.find(p => p.id === productId);
      if (product && recs.length < 5) {
        const targetCustomers = customers
          .filter(customer => {
            const customerOrders = orders.filter(order => order.customerId === customer.id);
            return !customerOrders.some(order => order.productId === productId);
          })
          .map(c => c.name)
          .slice(0, 3);

        if (targetCustomers.length > 0) {
          recs.push({
            product,
            reason: `Popular product (${count} purchases)`,
            confidence: Math.min(count / 20, 1),
            targetCustomers
          });
        }
      }
    });

    return recs.slice(0, 5);
  }, [customers, products, orders]);

  const getConfidenceColor = (confidence: number | 'high' | 'medium' | 'low') => {
    if (confidence === 'high' || (typeof confidence === 'number' && confidence >= 0.8)) return 'text-green-600 bg-green-100';
    if (confidence === 'medium' || (typeof confidence === 'number' && confidence >= 0.5)) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceLabel = (confidence: number | 'high' | 'medium' | 'low') => {
    if (confidence === 'high' || (typeof confidence === 'number' && confidence >= 0.8)) return 'High';
    if (confidence === 'medium' || (typeof confidence === 'number' && confidence >= 0.5)) return 'Medium';
    return 'Low';
  };

  const renderRecommendationCard = (rec: Recommendation | ManualRecommendation, isManual: boolean = false) => {
    const confidence = isManual ? (rec as ManualRecommendation).confidence : (rec as Recommendation).confidence;
    const reason = isManual ? (rec as ManualRecommendation).reason : (rec as Recommendation).reason;
    const targetCustomers = isManual ? (rec as ManualRecommendation).targetCustomers : (rec as Recommendation).targetCustomers;
    const product = rec.product;

    return (
      <div key={`${isManual ? 'manual' : 'auto'}-${rec.id}`} className={`border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isManual ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200'
      }`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h4>
              {isManual && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Manual
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {product.category} • {formatIndianCurrency(product.price)}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(confidence)}`}>
                {getConfidenceLabel(confidence)} Confidence
              </span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const threshold = typeof confidence === 'number' ? confidence * 5 : 
                    confidence === 'high' ? 5 : confidence === 'medium' ? 3 : 1;
                  return (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < threshold
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
              <strong>Reason:</strong> {reason}
            </p>
            {targetCustomers.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Target customers:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {targetCustomers.slice(0, 3).map((customerName: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                    >
                      {customerName}
                    </span>
                  ))}
                  {targetCustomers.length >= 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      +{targetCustomers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="ml-4">
            <Button size="sm" className="whitespace-nowrap">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Promote
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Recommendations</CardTitle>
        <CardDescription>AI-powered and manual product suggestions based on customer behavior</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 && manualRecommendations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recommendations available yet.</p>
            <p className="text-sm">Add more customers and products, or create manual recommendations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Manual Recommendations First */}
            {manualRecommendations.map(rec => renderRecommendationCard(rec, true))}
            
            {/* Auto-generated Recommendations */}
            {recommendations.map(rec => renderRecommendationCard(rec, false))}
          </div>
        )}
        
        {(recommendations.length > 0 || manualRecommendations.length > 0) && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Based on {customers.length} customers and {orders.length} orders</span>
                {manualRecommendations.length > 0 && (
                  <span className="text-blue-600 dark:text-blue-400">
                    • {manualRecommendations.length} manual
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm">
                View All Recommendations →
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Recommendations;

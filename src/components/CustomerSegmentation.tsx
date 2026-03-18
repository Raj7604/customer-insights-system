'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Customer } from '@/lib/data';

interface CustomerSegmentationProps {
  customers: Customer[];
}

const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({ customers }) => {
  // Calculate segment distribution
  const segmentData = React.useMemo(() => {
    const segments: { [key: string]: number } = {};
    
    customers.forEach(customer => {
      if (!segments[customer.segment]) {
        segments[customer.segment] = 0;
      }
      segments[customer.segment]++;
    });

    return Object.entries(segments).map(([segment, count]) => ({
      name: segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      value: count,
      percentage: ((count / customers.length) * 100).toFixed(1)
    }));
  }, [customers]);

  const COLORS = {
    'High Value': '#10b981',
    'Frequent': '#3b82f6', 
    'At Risk': '#f59e0b',
    'New': '#8b5cf6',
    'Inactive': '#6b7280'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>Distribution of customers by segment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={segmentData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {segmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [value, 'Customers']}
              labelFormatter={(label) => `Segment: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Segment Summary */}
        <div className="mt-4 space-y-2">
          {segmentData.map((segment) => (
            <div key={segment.name} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[segment.name as keyof typeof COLORS] || '#8884d8' }}
                />
                <span>{segment.name}</span>
              </div>
              <span className="font-medium">{segment.value} customers</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentation;

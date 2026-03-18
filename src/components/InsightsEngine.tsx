'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Insight } from '@/lib/data';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Target, DollarSign, Users } from 'lucide-react';

interface InsightsEngineProps {
  insights: Insight[];
}

const InsightsEngine: React.FC<InsightsEngineProps> = ({ insights }) => {
  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="h-5 w-5" />;
      case 'churn':
        return <AlertTriangle className="h-5 w-5" />;
      case 'segment':
        return <Target className="h-5 w-5" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Insights</CardTitle>
        <CardDescription>Key actionable insights from your customer data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No insights available at the moment.</p>
              <p className="text-sm">Check back later for new insights.</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-600 mt-1">
                      {getIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(insight.priority)}`}>
                          {insight.priority.toUpperCase()}
                        </span>
                        {insight.value && (
                          <span className="text-sm font-medium text-gray-700">
                            Value: {insight.value}
                          </span>
                        )}
                        {insight.trend && (
                          <div className="flex items-center gap-1">
                            {getTrendIcon(insight.trend)}
                            <span className="text-xs text-gray-600">
                              {insight.trend === 'up' ? 'Improving' : 
                               insight.trend === 'down' ? 'Declining' : 'Stable'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {insights.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Insights: {insights.length}</span>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Insights →
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsEngine;

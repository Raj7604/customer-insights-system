// Types for our customer insights system
export interface Customer {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  joinDate: string;
  lastPurchaseDate: string;
  totalOrders: number;
  totalSpent: number;
  segment: 'high-value' | 'frequent' | 'at-risk' | 'new' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
  tag?: 'high' | 'medium' | 'low';
  reason?: string;
}

export interface ManualRecommendation {
  id: string;
  product: Product;
  targetCustomers: string[];
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  isManual: true;
}

export interface Order {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  price: number;
  orderDate: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'revenue' | 'churn' | 'segment' | 'trend';
  priority: 'high' | 'medium' | 'low';
  value?: string | number;
  trend?: 'up' | 'down' | 'stable';
}

// Utility functions
export const formatIndianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// LocalStorage management
export const storage = {
  getCustomers: (): Customer[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('customers');
    return stored ? JSON.parse(stored) : [];
  },
  
  setCustomers: (customers: Customer[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('customers', JSON.stringify(customers));
  },
  
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  },
  
  setProducts: (products: Product[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('products', JSON.stringify(products));
  },
  
  getManualRecommendations: (): ManualRecommendation[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('manualRecommendations');
    return stored ? JSON.parse(stored) : [];
  },
  
  setManualRecommendations: (recommendations: ManualRecommendation[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('manualRecommendations', JSON.stringify(recommendations));
  },
  
  getTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    return (stored as 'light' | 'dark') || 'light';
  },
  
  setTheme: (theme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme', theme);
  }
};

// Indian dummy data generation
const generateIndianCustomers = (): Customer[] => {
  const firstNames = ['Raj', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Rahul', 'Kavita', 'Arun', 'Meera', 'Vijay', 'Sonia', 'Rohit', 'Pooja', 'Manish', 'Divya'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Agarwal', 'Jain', 'Malhotra', 'Reddy', 'Nair', 'Patel', 'Singh', 'Kumar', 'Mishra', 'Choudhary', 'Bhatia', 'Iyer', 'Menon'];
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Nagpur', 'Kochi', 'Coimbatore'];
  
  const customers: Customer[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const joinDate = new Date(2023 - Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const lastPurchase = new Date();
    lastPurchase.setDate(lastPurchase.getDate() - Math.floor(Math.random() * 365));
    
    const totalOrders = Math.floor(Math.random() * 50) + 1;
    const totalSpent = Math.floor(Math.random() * 200000) + 5000; // INR
    
    // Simple segmentation logic
    let segment: Customer['segment'];
    const daysSinceLastPurchase = (Date.now() - lastPurchase.getTime()) / (1000 * 60 * 60 * 24);
    
    if (totalSpent > 50000 && totalOrders > 10) { // INR thresholds
      segment = 'high-value';
    } else if (totalOrders > 15) {
      segment = 'frequent';
    } else if (daysSinceLastPurchase > 90) {
      segment = 'at-risk';
    } else if (daysSinceLastPurchase > 180) {
      segment = 'inactive';
    } else {
      segment = 'new';
    }
    
    customers.push({
      id: `cust_${i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      age: Math.floor(Math.random() * 50) + 18,
      location: cities[Math.floor(Math.random() * cities.length)],
      joinDate: joinDate.toISOString(),
      lastPurchaseDate: lastPurchase.toISOString(),
      totalOrders,
      totalSpent,
      segment
    });
  }
  
  return customers;
};

const generateIndianProducts = (): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Food'];
  const products: Product[] = [];
  
  const productNames = [
    'Wireless Earbuds', 'Smart Watch', 'Laptop Stand', 'USB-C Cable', 'Bluetooth Speaker',
    'Running Shoes', 'Yoga Mat', 'Water Bottle', 'Backpack', 'Phone Case',
    'Coffee Maker', 'Desk Lamp', 'Notebook Set', 'Pen Set', 'Mouse Pad',
    'Kurta', 'Jeans', 'Sneakers', 'Jacket', 'Scarf',
    'Novel', 'Cookbook', 'Textbook', 'Magazine', 'Comic Book',
    'Plant Pot', 'Garden Tools', 'Picture Frame', 'Candle', 'Throw Pillow'
  ];
  
  for (let i = 1; i <= 30; i++) {
    products.push({
      id: `prod_${i}`,
      name: productNames[i - 1],
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 15000) + 500, // INR
      description: `High-quality ${productNames[i - 1].toLowerCase()} with premium features`
    });
  }
  
  return products;
};

const generateOrders = (customers: Customer[], products: Product[]): Order[] => {
  const orders: Order[] = [];
  let orderId = 1;
  
  customers.forEach(customer => {
    const orderCount = customer.totalOrders;
    
    for (let i = 0; i < orderCount; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const orderDate = new Date(customer.joinDate);
      orderDate.setDate(orderDate.getDate() + Math.floor(Math.random() * 365));
      
      orders.push({
        id: `order_${orderId++}`,
        customerId: customer.id,
        productId: product.id,
        quantity: Math.floor(Math.random() * 3) + 1,
        price: product.price,
        orderDate: orderDate.toISOString(),
        status: 'completed'
      });
    }
  });
  
  return orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
};

// Generate and export data
export const initialCustomers = generateIndianCustomers();
export const initialProducts = generateIndianProducts();
export const initialOrders = generateOrders(initialCustomers, initialProducts);

// Dynamic getters that combine initial data with user-added data
export const getCustomers = (): Customer[] => {
  const storedCustomers = storage.getCustomers();
  return [...initialCustomers, ...storedCustomers];
};

export const getProducts = (): Product[] => {
  const storedProducts = storage.getProducts();
  return [...initialProducts, ...storedProducts];
};

export const getOrders = (): Order[] => {
  const allCustomers = getCustomers();
  const allProducts = getProducts();
  return generateOrders(allCustomers, allProducts);
};

// Calculate insights
export const generateInsights = (customersList: Customer[], ordersList: Order[]): Insight[] => {
  const insights: Insight[] = [];
  
  // Revenue insights
  const totalRevenue = ordersList.reduce((sum, order) => sum + (order.price * order.quantity), 0);
  const highValueCustomers = customersList.filter(c => c.segment === 'high-value');
  const highValueRevenue = highValueCustomers.reduce((sum, customer) => {
    const customerOrders = ordersList.filter(o => o.customerId === customer.id);
    return sum + customerOrders.reduce((orderSum, order) => orderSum + (order.price * order.quantity), 0);
  }, 0);
  
  if (highValueCustomers.length > 0 && (highValueRevenue / totalRevenue) > 0.7) {
    insights.push({
      id: 'insight_1',
      title: 'High-Value Customer Concentration',
      description: `Top ${Math.round((highValueCustomers.length / customersList.length) * 100)}% of customers generate ${Math.round((highValueRevenue / totalRevenue) * 100)}% of revenue`,
      type: 'revenue',
      priority: 'high',
      value: `${Math.round((highValueRevenue / totalRevenue) * 100)}%`,
      trend: 'up'
    });
  }
  
  // Churn insights
  const atRiskCustomers = customersList.filter(c => c.segment === 'at-risk');
  const inactiveCustomers = customersList.filter(c => c.segment === 'inactive');
  const totalAtRisk = atRiskCustomers.length + inactiveCustomers.length;
  
  if (totalAtRisk > customersList.length * 0.2) {
    insights.push({
      id: 'insight_2',
      title: 'Customer Churn Risk',
      description: `${totalAtRisk} customers are at risk of churning (inactive for 30+ days)`,
      type: 'churn',
      priority: 'high',
      value: totalAtRisk.toString(),
      trend: 'down'
    });
  }
  
  // Segment insights
  const frequentBuyers = customersList.filter(c => c.segment === 'frequent');
  if (frequentBuyers.length > customersList.length * 0.3) {
    insights.push({
      id: 'insight_3',
      title: 'Strong Customer Loyalty',
      description: `${frequentBuyers.length} customers are frequent buyers (15+ orders)`,
      type: 'segment',
      priority: 'medium',
      value: frequentBuyers.length.toString(),
      trend: 'up'
    });
  }
  
  return insights;
};

export const insights = generateInsights(initialCustomers, initialOrders);

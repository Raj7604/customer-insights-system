# Customer Insights & Recommendation System
## 🌐 Live Demo

👉 **[Click here to view live project 🚀](https://customer-insights-system-ynln-j8igsabcu.vercel.app)**
A comprehensive full-stack web application for analyzing customer data and generating actionable insights with personalized product recommendations.

## 🎯 Features

### Customer Dashboard
- **Key Metrics Display**: Total customers, revenue, average order value, repeat vs new customers
- **Interactive Charts**: Sales trends over time, customer segmentation pie charts
- **Real-time Data**: Dynamic updates with sample customer data

### Customer Segmentation
- **RFM Analysis**: Segment customers based on Recency, Frequency, and Monetary value
- **Customer Types**:
  - High-value customers (high spend, frequent purchases)
  - Frequent buyers (15+ orders)
  - At-risk customers (inactive for 30+ days)
  - New customers (first-time buyers)
  - Inactive customers (inactive for 180+ days)

### Recommendation Engine
- **Collaborative Filtering**: "Frequently bought together" analysis
- **Popular Products**: Trending items based on purchase history
- **Targeted Recommendations**: Product suggestions for specific customer segments
- **Confidence Scoring**: High/Medium/Low confidence indicators

### Insights Engine
- **Business Intelligence**: Automated insights from customer data
- **Revenue Analysis**: Customer concentration and revenue distribution
- **Churn Prediction**: At-risk customer identification
- **Trend Analysis**: Customer loyalty and behavior patterns

### Search & Filter
- **Customer Search**: Find customers by name or email
- **Segment Filtering**: Filter by customer segment
- **Real-time Results**: Instant filtering as you type

## 🧱 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **ShadCN UI**: Modern component library
- **Recharts**: Interactive charts and visualizations
- **Lucide React**: Beautiful icons

### Backend
- **Next.js API Routes**: Server-side functionality
- **TypeScript**: End-to-end type safety

### Data
- **In-memory Database**: Realistic sample data
- **100+ Customers**: Diverse customer profiles
- **30+ Products**: Various product categories
- **1000+ Orders**: Comprehensive order history

## 📊 Sample Data

The application includes realistic sample data:

- **Customers**: 100 customers with demographics, purchase history, and segmentation
- **Products**: 30 products across 8 categories (Electronics, Clothing, Books, etc.)
- **Orders**: 1000+ orders with dates, quantities, and statuses
- **Insights**: Automated business insights generated from the data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Customer Insights  Recommendation System"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Customer Insights  Recommendation System/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── ui/                 # ShadCN UI components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── CustomerSegmentation.tsx
│   │   ├── InsightsEngine.tsx
│   │   ├── Recommendations.tsx
│   │   └── SalesChart.tsx
│   └── lib/
│       ├── data.ts              # Sample data and types
│       └── utils.ts             # Utility functions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎨 UI Features

### Professional Design
- **Modern SaaS Interface**: Clean, professional dashboard design
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Elements**: Hover states, transitions, and micro-interactions
- **Color-coded Segments**: Visual differentiation for customer segments

### Data Visualization
- **Sales Trends**: Line charts showing revenue over time
- **Segment Distribution**: Pie charts for customer segmentation
- **Confidence Indicators**: Star ratings for recommendation confidence
- **Trend Arrows**: Visual indicators for metrics trends

## 📈 Business Value

### For Marketing Teams
- **Targeted Campaigns**: Segment-specific marketing strategies
- **Customer Retention**: Identify at-risk customers and prevent churn
- **Cross-selling**: Product recommendations to increase average order value

### For Sales Teams
- **Lead Prioritization**: Focus on high-value customers
- **Upselling Opportunities**: Relevant product suggestions
- **Customer Insights**: Understanding purchase patterns

### For Management
- **Revenue Analytics**: Clear visibility into financial performance
- **Customer Health**: Overall customer base metrics
- **Strategic Planning**: Data-driven business decisions

## 🔧 Customization

### Adding New Customer Segments
Modify the segmentation logic in `src/lib/data.ts` to add custom customer segments based on your business rules.

### Custom Insights
Extend the insights engine in `src/lib/data.ts` to add industry-specific business intelligence.

### Integration
The application is designed to easily integrate with:
- Real databases (PostgreSQL, MongoDB, Supabase)
- External APIs (CRM systems, payment processors)
- Authentication providers (Auth0, Firebase Auth)

## 📱 Mobile Responsive

The application is fully responsive and works seamlessly across:
- Desktop (1920x1080 and above)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The application can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or support:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

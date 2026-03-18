# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### Option 1: Using the Installation Script (Windows)
1. Double-click `install.bat` file
2. Wait for dependencies to install
3. Run `npm run dev` in the terminal

### Option 2: Manual Installation
1. Open terminal/command prompt
2. Navigate to the project directory:
   ```bash
   cd "Customer Insights  Recommendation System"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Option 3: If PowerShell Script Execution is Disabled
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Then run the installation script or manual installation

## Running the Application

After installation:
```bash
npm run dev
```

Open your browser and navigate to:
**http://localhost:3000**

## What You'll See

- 📊 **Dashboard Overview**: Key metrics and KPIs
- 📈 **Sales Charts**: Revenue trends over time
- 👥 **Customer Segmentation**: Visual breakdown of customer types
- 💡 **Business Insights**: AI-powered recommendations
- 🎯 **Product Recommendations**: Collaborative filtering suggestions
- 🔍 **Search & Filter**: Find customers instantly

## Troubleshooting

### "Scripts are disabled" Error
Run in PowerShell (as Admin):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
Kill the process or use different port:
```bash
npx kill-port 3000
# or
npm run dev -- -p 3001
```

### Dependencies Not Installing
Clear npm cache:
```bash
npm cache clean --force
npm install
```

## Next Steps

1. ✅ Explore the dashboard
2. ✅ Try searching for customers
3. ✅ Filter by customer segments
4. ✅ View product recommendations
5. ✅ Check business insights

## Need Help?

- Check the full `README.md` for detailed documentation
- Review the code comments for implementation details
- All components are fully responsive and production-ready

---

**Happy Coding! 🎉**

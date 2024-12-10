# 🗺️ Store Locator

A modern, interactive store locator application built with React and Node.js that helps users find nearby stores based on various categories and their current location.

## ✨ Features

- 🏪 **Multiple Store Categories**
  - Grocery stores
  - Electronics shops
  - Restaurants
  - Cafes
  - Pharmacies

- 📍 **Advanced Location Features**
  - Automatic user location detection
  - Custom location search
  - Interactive map interface
  - Real-time store filtering

- 🎨 **Modern UI/UX**
  - Material-UI components
  - Responsive design
  - Dark mode support
  - Interactive markers with store details
  - Smooth animations using Framer Motion

## 🚀 Tech Stack

### Frontend
- React.js
- Material-UI
- Google Maps JavaScript API
- Framer Motion
- Axios

### Backend
- Node.js
- Express
- Google Places API
- Node Geocoder
- GeoIP-lite

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/[your-username]/store-locator.git
cd store-locator
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Backend (.env):
```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PLACES_API_RADIUS=5000
```

Frontend (.env):
```env
REACT_APP_BACKEND_URL=http://localhost:4000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_GOOGLE_MAP_ID=your_map_id
```

4. **Start the application**
```bash
# Start backend server (from backend directory)
npm start

# Start frontend development server (from frontend directory)
npm start
```

## 🔑 API Keys Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API key)
5. Add appropriate API key restrictions:
   - HTTP referrers
   - IP addresses
   - Application restrictions

## 🌟 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Allow location access for better experience
3. Use the search bar to find a specific location
4. Filter stores by category using the toggle buttons
5. Click on markers to view store details

## 🔄 Development Workflow

1. Create feature branches from dev:
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

2. Make changes and commit:
```bash
git add .
git commit -m "feat: your feature description"
```

3. Push changes and create PR:
```bash
git push -u origin feature/your-feature-name
```

4. Create Pull Request to merge into dev branch

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Google Maps Platform
- Material-UI Team
- React Community

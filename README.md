# LotScout - FIU Parking App

An iOS app that helps FIU students find parking near their classes by inputting the building name and getting nearby garage recommendations with real-time availability.

## Features

- 🔍 **Building Search**: Input your class building to find nearby parking
- 🗺️ **Interactive Maps**: View garage locations on Google Maps
- 📊 **Real-time Data**: Get current parking availability and rates
- 🧭 **Navigation**: Navigate directly to recommended garages
- 📱 **Mobile-First**: Built for iOS with React Native and Expo

## Tech Stack

### Frontend
- **React Native** with Expo CLI
- **React Navigation** for screen navigation
- **Google Maps API** for map integration
- **Axios** for API calls
- **Expo Location** for GPS functionality

### Backend
- **Python FastAPI** for the API server
- **Firebase** for data storage and authentication
- **BeautifulSoup** for web scraping garage data
- **Uvicorn** as the ASGI server

## Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- Expo CLI
- iOS Simulator or physical iOS device
- Google Maps API key

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd LotScout-FIU
```

### 2. Backend Setup

Navigate to the server directory and install Python dependencies:
```bash
cd server
python -m pip install -r requirements.txt
```

### 3. Frontend Setup

Navigate to the client directory and install Node.js dependencies:
```bash
cd ../client
npm install
```

### 4. Environment Configuration

Create a `.env` file in the server directory:
```bash
cd ../server
touch .env
```

Add your configuration:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# FIU SSO Configuration (if implementing)
FIU_SSO_CLIENT_ID=your-sso-client-id
FIU_SSO_CLIENT_SECRET=your-sso-client-secret
```

### 5. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app to get your config
4. Download the service account key and place it in the server directory
5. Update the Firebase configuration in `server/app.py`

## Running the Application

### Start the Backend Server

```bash
cd server
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

### Start the Frontend App

```bash
cd client
npx expo start
```

This will open the Expo development server. You can:
- Press `i` to open in iOS Simulator
- Scan the QR code with the Expo Go app on your phone
- Press `w` to open in web browser

## API Endpoints

- `GET /` - Health check
- `GET /garages` - Get all available garages
- `POST /find-parking` - Find parking near a building
- `GET /garage/{id}` - Get specific garage details
- `GET /scrape-garages` - Update garage data from FIU website

## Project Structure

```
LotScout-FIU/
├── client/                 # React Native frontend
│   ├── App.js             # Main app component
│   ├── package.json       # Node.js dependencies
│   └── assets/            # Images and static files
├── server/                # Python backend
│   ├── app.py             # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
└── README.md             # This file
```

## Development Workflow

1. **Backend Development**: Modify `server/app.py` for API changes
2. **Frontend Development**: Modify `client/App.js` for UI changes
3. **Testing**: Use the Expo development tools for testing on device/simulator
4. **API Testing**: Visit `http://localhost:8000/docs` for interactive API documentation

## Next Steps

- [ ] Implement FIU SSO authentication
- [ ] Add real-time garage data webscraping
- [ ] Integrate with FIU's parking system API
- [ ] Add push notifications for parking availability
- [ ] Implement user preferences and favorites
- [ ] Add parking history and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 
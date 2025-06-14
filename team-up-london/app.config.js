export default {
  "expo": {
    "name": "team-up-london",
    "slug": "team-up-london",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.drp02.teamuplondon",
      "config": {
        "googleMapsApiKey":  process.env.GOOGLE_MAPS_API_KEY
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "package": "com.drp02.teamuplondon",
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "6e26b843-3289-4f78-adb6-9f8f3b5fc71b"
      }
    },
    "owner": "drp02",
    "plugins": [
      "expo-notifications"
    ]
  }
}

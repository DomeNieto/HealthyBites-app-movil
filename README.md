# HealthyBites-app-mobile

**HealthyBites** is a mobile application designed to help you manage your recipes, follow a meal plan, and track your calorie intake.

## Prerequisites

Before installing and running the app, make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- A physical device to test the application with the **Expo Go** app installed.

## Installation

### 1. Clone the Repository

First, clone the repository to your local machine. Open a terminal and run the following command:

```bash
git clone https://github.com/DomeNieto/HealthyBites-app-movil.git
````

### 2. Install Dependencies

Navigate to the project directory and run the following command to install all necessary dependencies:

```bash
cd HealthyBites-app-movil
npm install
```

Make sure to also install the additional dependencies required for the app to function properly:

* **Axios** (for making HTTP requests):

```bash
npm install axios
```

* **AsyncStorage**:

```bash
npm install @react-native-async-storage/async-storage
```

* **React Navigation**:

```bash
npm install @react-navigation/native
```

* **Expo Router**:

```bash
npm install expo-router
```

* **React Native Toast Message** (for toast-style notifications):

```bash
npm install react-native-toast-message
```

* **React Native Picker** (for dropdown list selections):

```bash
npm install @react-native-picker/picker
```

* **React Native Vector Icons** (for vector icons):

```bash
npm install react-native-vector-icons
```

### 4. Start the Application

Once all dependencies are installed, you can start the application using Expo. To start the app in development mode, run:

```bash
npm start
```

Scan the QR code that appears with your mobile device. Make sure that both your device and your computer are connected to the same network, and that the **Expo Go** app is installed on your phone to ensure everything works smoothly. Also, make sure the API is up and running so the application can work correctly.


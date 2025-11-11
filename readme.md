# Wanderlust - Airbnb Clone

A full-featured Airbnb Clone built with **Node.js, Express, MongoDB, and EJS**, where users can explore listings, book stays, and make secure payments using **Stripe**. 

## Live Demo

[View Project on Render](https://airbnb-project-iozc.onrender.com)

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** EJS, Bootstrap
- **Database:** MongoDB Atlas
- **Auth:** Passport.js
- **Image Uploads:** Cloudinary
- **Deployment:** Render

## Features

- User authentication (Sign Up / Login / Logout)
- Create & Manage Listings
- Upload Images to Cloudinary
- Flash messages for success/error handling  
- Real-time booking availability check  
- Stripe payment integration

## Environment Variables

# Cloudinary configuration
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret

# Map API
MAP_API_KEY=your_mapbox_api_key

# Stripe configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Domain
DOMAIN=http://localhost:8000/listings

# MongoDB Atlas connection
ATLASDB_URL=your_mongodb_atlas_connection_string

# Session secret
SECRET=your_session_secret

## Installation & Setup

### Clone the repository

git clone https://github.com/your-username/Airbnb-Project.git
cd Airbnb-Project

### Install dependencies

npm install

### Create .env file and add your environment variables

### Run the app

node app.js

Visit http://localhost:8080 to view it locally.

## Author

Laxmi Gupta  
[GitHub](https://github.com/Laxmi-gupta)


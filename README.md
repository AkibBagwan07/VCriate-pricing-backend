# VCriate Pricing Module Backend

This project implements a configurable pricing module for ride-based services, inspired by platforms like Uber/Ola. It allows flexible pricing based on distance, time, day, and waiting period.

## Features

- CRUD API for managing pricing configurations
- Pricing calculation API based on:
  - Base distance price
  - Additional distance
  - Time multiplier tiers
  - Waiting charges
- Support for multiple active/inactive configs
- Change logs with actor tracking

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- Deployed on Render


## Installation

git clone https://github.com/AkibBagwan07/VCriate-pricing-backend.git
cd VCriate-pricing-backend
npm install
npm start

## API live link 
https://vcriate-pricing-backend.onrender.com

## API Endpoints

### Pricing Configuration
- `POST /api/configs` – Create new config
- `GET /api/configs` – Get all configs
- `PUT /api/configs/:id` – Update config by ID
- `DELETE /api/configs/:id` – Delete config by ID

### Price Calculation
- `POST /api/calculate`
  ```json
  {
    "distanceKm": 5,
    "rideMinutes": 80,
    "waitingMinutes": 10,
    "day": "Tuesday"
  }


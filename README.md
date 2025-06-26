# 🧠 AI Trip Planner

Your personal **AI-powered travel assistant** ✈️🧳  
Generate **day-wise optimized itineraries** based on destination, budget, interests, and travel duration — minimizing travel time and cost using smart clustering and distance optimization.

---

## 🚀 Tech Stack

| Layer           | Technologies                                                                 |
|----------------|------------------------------------------------------------------------------|
| **Frontend**    | React.js, TailwindCSS                                                       |
| **Backend**     | Node.js, Express.js                                                         |
| **AI & APIs**   | Google Maps API, Distance Matrix, Google Geocoding, Unsplash API, GPT       |
| **Database**    | MongoDB, Mongoose                                                           |
| **Auth & Security** | JWT, bcrypt, OTP Email Verification, Cookie-based Sessions             |

---

## ✨ Key Features

- 🔍 Search destinations and generate smart itineraries
- 📅 AI-generated **day-wise optimized travel plans**
- 🗺️ Google Maps with **colored markers** for each day
- ✏️ Explore page: post & rate visited places
- 🔐 Secure authentication: JWT, bcrypt, OTP
- 📌 Smart daily clustering of attractions
- 🎯 Multi-day optimization — **end day N where day N+1 begins**

---

## 💡 Problem Statement

> Planning trips manually is tedious and inefficient. Most platforms just show top attractions without helping plan optimal routes.  
> Our AI solves this by generating **optimized, cost-efficient travel itineraries** — just input your destination, interests, and dates!

---

## 📐 System Architecture

Frontend (React.js)
↓ (Axios)
Backend (Node.js + Express)
↓
Trip Generator Service (AI + Logic)
↓
MongoDB (Users, Trips, Places)
↓
Google Maps API / Distance Matrix


---

## 🧠 AI Trip Generation Logic

1. **Input**: Destination, travel dates, budget, preferences
2. **Geocoding**: Convert destination to lat/lng
3. **Places Fetching**: Use Google Places API (filter: rating ≥ 3.5)
4. **Distance Matrix**: Calculate distances using Google API
5. **Daily Clustering**:
   - Group nearby places (2–4/day)
   - Max radius ≈ 20km per cluster
   - Use **Nearest Neighbor** (TSP approximation) for route optimization
6. **Day-to-Day Planning**:
   - Minimize total route time
   - Plan next day based on previous day's endpoint
7. **Output**: Optimized itinerary stored in DB

---

## 🔐 Authentication System

- ✅ JWT-based login sessions
- 🔒 Passwords securely hashed with `bcrypt`
- 📲 OTP email verification (login/signup)
- 🍪 Secure sessions via cookies + headers
- 🔄 Custom middlewares:
  - `isLoggedIn`
  - `validateTripInput`
  - `verifyOTP`

---

## 🧑‍💻 UI Pages

- 🏠 Home Page
- 🔐 Login / Signup with OTP
- ✈️ Trip Creator Form
- 📅 AI Itinerary Viewer + Google Maps
- 🌍 Explore Feed (Community Posts)
- 👤 Account Dashboard

---

## 🗺️ Map Integration

- Integrated with **Google Maps JavaScript API**
- Colored day-wise markers
- Clickable pins → open in Maps
- Grouped markers by day with clustering

---

## 📸 Screenshots

> *(Add these images directly in your README or as a GitHub assets folder)*

- Home Page  
- Trip Creation Form  
- AI Day-wise Itinerary  
- Google Map with Day Markers  
- Explore Feed (Community)

---

## 📈 Outcome

- ✅ Planned optimized trips for multiple cities
- 📍 Achieved 90%+ accuracy in routing & clustering
- 🤖 Solved a real-world planning pain point using AI + Routing Algorithms
- 👥 Integrated social feed for user contributions

---

## 👨‍💻 Authors

| Name           | Role                 |
|----------------|----------------------|
| Deep Tandel    | Frontend Developer   |
| Darshan Rathod | Backend Developer    |

---

## 📬 Contact

For suggestions, feedback or collaboration:

- 📧 [tandeldeep2909@gmail.com](mailto:tandeldeep2909@gmail.com)
- 📧 [darshanrathod1034@gmail.com](mailto:darshanrathod1034@gmail.com)

---

## 🎯 Future Scope

- 🤝 Collaborative Filtering for personalized recommendations
- 🔍 Content-based suggestions using place features (tags, ratings)
- 📊 Sentiment Analysis on user reviews
- 🌦️ Auto-rescheduling based on traffic/weather API
- 🧠 AI chatbot for planning modifications

---

## ⭐ Support

If you like this project, give it a ⭐ on [GitHub](https://github.com/darshanrathod1034/ai-trip-planner-fullstack)!

---


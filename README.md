🧠 AI Trip Planner
Your personal travel assistant powered by AI. Generate day-wise optimized itineraries based on destination, budget, interests, and travel duration. 🧳✨
Designed to minimize travel time and cost using smart distance optimization and clustering logic.

🚀 Tech Stack
Frontend	Backend	AI & APIs	Database	Auth & Security
React.js	Node.js + Express	Google Maps API, Distance Matrix	MongoDB	JWT, bcrypt, OTP
TailwindCSS	RESTful API	unsplash API , Google text api	Mongoose	Cookie-based Sessions
✨ Key Features
🔍 Search destination and generate smart itineraries
📅 AI-generated day-wise plans with optimized routes
📍 Google Maps with colored day markers and live directions
✏️ Explore Page – Post & rate visited places
🛡️ Secure Auth with JWT, bcrypt, OTP verification
📌 Day-to-day place clustering with smart routing
🎯 Multi-day Optimization — Routes end where the next begins
💡 Problem Statement
Planning trips manually is tedious and inefficient. Most platforms show top attractions but don’t plan optimal routes.
Our AI solves this by generating optimized, cost-efficient travel itineraries — just input your destination, interests, and dates!

📐 System Architecture
Frontend (React)
   ↓
API Gateway (Axios)
   ↓
Backend (Node.js + Express)
   ↓
Trip Generator Service (AI Logic)
   ↓
MongoDB (User, Places, Trips)
   ↓
Google Maps API / Distance Matrix
🧠 AI Trip Generation Logic
🎯 Input: destination, dates, budget, preferences
📍 Geocode: convert destination to lat/lng
🗺️ Places API: fetch top-rated attractions (filter rating ≥ 3.5)
📏 Distance Matrix: compute travel distances using Google API (chunked if >10)
🚗 Daily Clustering:
2–4 nearby places/day (max distance ≤ 20km)
Nearest Neighbor (TSP approximation)
Order days by proximity (day-to-day)
🧠 AI Output: fully optimized, saved itinerary in DB
🔐 Authentication System
✅ JWT-based login session
🔐 Passwords hashed using bcrypt
📲 OTP email verification
🌐 Cookies + headers for secure user access
🔄 Middleware: isLoggedIn, validateTripInput, verifyOTP
🧑‍💻 UI Pages
Home Page
Login / Sign Up with OTP
Trip Creator Form
AI Itinerary Viewer + Google Maps
Community Explore Feed
Create Travel Post
Account Dashboard
🌍 Map Integration
Integrated with Google Maps JS API
Colored Day Markers on Map
Click markers → open location in Google Maps
Day-wise grouping using colored pins
📸 Screenshots (Add Here)
[ Screenshot 2025-05-02 214241 Screenshot 2025-05-02 214335 image ] Home pages
[Screenshot 2025-05-02 220236 Screenshot 2025-05-02 214618 image ] Trip Creation Form
[Screenshot 2025-05-02 215140 Screenshot 2025-05-02 215231 Screenshot 2025-05-02 215313 Screenshot 2025-05-02 215344 ] AI Day-wise Itinerary
[ Screenshot 2025-05-02 215431 Screenshot 2025-05-02 215534 Screenshot 2025-05-02 215606 Screenshot 2025-05-02 215631 Screenshot 2025-05-02 215720
Screenshot 2025-05-02 215752 ] Google Map with Markers

[Screenshot 2025-05-02 215850 image ] Explore Feed
📈 Outcome
✅ Planned trips for multiple cities with 90%+ route accuracy
🔥 Solved a real-world pain point using AI + Routing Algorithms
👥 Built a social aspect with community rating and trip posting
🧑‍💻 Authors
Name	Role
Deep Tandel	Frontend Developer
Darshan Rathod	Backend Developer
📬 Contact
For suggestions, collaboration or questions:
📧 tandeldeep2909@gmail.com 📧 darshanrathod1034@gmail.com

🎯 Future Scope
🤖 Collaborative Filtering for user-based recommendations
🧬 Content-based suggestions using place features
📊 Sentiment Analysis on reviews
🗺️ Auto-trip rescheduling based on traffic/weather
⭐ If you like this project, give it a star on GitHub!
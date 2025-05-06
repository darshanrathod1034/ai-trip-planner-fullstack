

# 🧠 AI Trip Planner 

Your **personal travel assistant** powered by AI. Generate day-wise optimized itineraries based on destination, budget, interests, and travel duration. 🧳✨  
Designed to minimize travel time and cost using smart distance optimization and clustering logic.

---

## 🚀 Tech Stack

| Frontend     | Backend           | AI & APIs                         | Database   | Auth & Security        |
|--------------|-------------------|-----------------------------------|------------|------------------------|
| React.js     | Node.js + Express | Google Maps API, Distance Matrix  | MongoDB    | JWT, bcrypt, OTP       |
| TailwindCSS  | RESTful API       | unsplash API   , Google text api  | Mongoose   | Cookie-based Sessions  |

---

## ✨ Key Features

- 🔍 Search destination and generate **smart itineraries**
- 📅 AI-generated **day-wise plans** with optimized routes
- 📍 Google Maps with colored **day markers** and live directions
- ✏️ **Explore Page** – Post & rate visited places
- 🛡️ Secure Auth with **JWT**, **bcrypt**, **OTP verification**
- 📌 Day-to-day **place clustering** with smart routing
- 🎯 **Multi-day Optimization** — Routes end where the next begins

---

## 💡 Problem Statement

> Planning trips manually is tedious and inefficient. Most platforms show top attractions but don’t plan optimal routes.  
Our AI solves this by generating **optimized, cost-efficient travel itineraries** — just input your destination, interests, and dates!

---

## 📐 System Architecture

```
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
```

---

## 🧠 AI Trip Generation Logic

1. 🎯 **Input**: destination, dates, budget, preferences
2. 📍 **Geocode**: convert destination to lat/lng
3. 🗺️ **Places API**: fetch top-rated attractions (filter rating ≥ 3.5)
4. 📏 **Distance Matrix**: compute travel distances using Google API (chunked if >10)
5. 🚗 **Daily Clustering**:
   - 2–4 nearby places/day (max distance ≤ 20km)
   - Nearest Neighbor (TSP approximation)
   - Order days by proximity (day-to-day)
6. 🧠 **AI Output**: fully optimized, saved itinerary in DB

---

## 🔐 Authentication System

- ✅ **JWT-based login session**
- 🔐 Passwords hashed using `bcrypt`
- 📲 **OTP email verification**
- 🌐 Cookies + headers for secure user access
- 🔄 Middleware: `isLoggedIn`, `validateTripInput`, `verifyOTP`

---

## 🧑‍💻 UI Pages

- **Home Page**
- **Login / Sign Up with OTP**
- **Trip Creator Form**
- **AI Itinerary Viewer + Google Maps**
- **Community Explore Feed**
- **Create Travel Post**
- **Account Dashboard**

---

## 🌍 Map Integration

- Integrated with **Google Maps JS API**
- Colored **Day Markers** on Map
- Click markers → open location in Google Maps
- Day-wise grouping using colored pins

---

## 📸 Screenshots (Add Here)

- [ ![Screenshot 2025-05-02 214241](https://github.com/user-attachments/assets/75e915e3-a072-4d17-b308-49487a2b8e69)
![Screenshot 2025-05-02 214335](https://github.com/user-attachments/assets/a2dd8668-69ee-42d9-8dca-ccc9d4e2303c)
![image](https://github.com/user-attachments/assets/a042c984-6890-4218-b0cc-318bc4397bce)
] Home pages
- [![Screenshot 2025-05-02 220236](https://github.com/user-attachments/assets/5dd0d2f6-1658-4e23-b346-0210d9e699c4)
 ![Screenshot 2025-05-02 214618](https://github.com/user-attachments/assets/48765290-f0a5-420c-84b8-0c3e37cc51c8)
![image](https://github.com/user-attachments/assets/584b8665-0752-454f-8237-5faff39616eb)
] Trip Creation Form  
- [![Screenshot 2025-05-02 215140](https://github.com/user-attachments/assets/b24b02c4-595a-4a62-8ce3-cb7fa6b7be4d)
![Screenshot 2025-05-02 215231](https://github.com/user-attachments/assets/9f7ddbe5-7faa-43dd-b259-a714f847ac13)
 ![Screenshot 2025-05-02 215313](https://github.com/user-attachments/assets/ad6b6931-608c-4146-a152-58b16d562fb3)
![Screenshot 2025-05-02 215344](https://github.com/user-attachments/assets/222d7438-36e1-4102-a54a-50b5ebd58bee)
] AI Day-wise Itinerary  
- [ ![Screenshot 2025-05-02 215431](https://github.com/user-attachments/assets/58ada9c9-e7dc-4a64-b341-a2f6279cfce2)
![Screenshot 2025-05-02 215534](https://github.com/user-attachments/assets/efedb9a7-b1ce-4774-b0bc-127e4d3bd624)
![Screenshot 2025-05-02 215606](https://github.com/user-attachments/assets/12c525bb-5bc3-46aa-a7f6-afc208e95d37)
![Screenshot 2025-05-02 215631](https://github.com/user-attachments/assets/a593e22e-4de8-41d8-a842-6d49d09acf73)
  ![Screenshot 2025-05-02 215720](https://github.com/user-attachments/assets/ece624bd-4f81-494d-9e7f-d82fb9999af6)

![Screenshot 2025-05-02 215752](https://github.com/user-attachments/assets/68f9de8d-7a7e-4003-ab9b-b8e602831b8b)
] Google Map with Markers  
- [![Screenshot 2025-05-02 215850](https://github.com/user-attachments/assets/4393b52d-3b92-4373-8e00-844e2efa7f31)
 ![image](https://github.com/user-attachments/assets/362a902d-eac2-43f5-8225-22fdf5a727a1)
] Explore Feed  

---

## 📈 Outcome

- ✅ Planned trips for multiple cities with 90%+ route accuracy
- 🔥 Solved a real-world pain point using **AI + Routing Algorithms**
- 👥 Built a social aspect with community rating and trip posting

---

## 🧑‍💻 Authors

| Name           | Role              |
|----------------|-------------------|
| Deep Tandel    | Frontend Developer |
| Darshan Rathod    | Backend Developer  |

---

## 📬 Contact

For suggestions, collaboration or questions:  
📧 **tandeldeep2909@gmail.com**
📧 **darshanrathod1034@gmail.com**



---

## 🎯 Future Scope

- 🤖 Collaborative Filtering for user-based recommendations
- 🧬 Content-based suggestions using place features
- 📊 Sentiment Analysis on reviews
- 🗺️ Auto-trip rescheduling based on traffic/weather

---

**⭐ If you like this project, give it a star on GitHub!**

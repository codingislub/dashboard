# 🍽️ Restaurant Dashboard

Hey there! This is a real-time dashboard I built to help restaurant owners keep track of their operations across different delivery platforms like DoorDash and Uber Eats. Think of it as mission control for your restaurant empire.

## What Does It Do?

Ever wondered how all your restaurant locations are performing right now? This dashboard gives you the complete picture:
- See all your stores at a glance with their current status
- Track important metrics like success rates, processing times, and revenue
- Monitor incoming orders in real-time
- Get health scores for each location (like a report card for restaurants!)
- Spot problems before they become disasters

## Getting It Running

You'll need Python (3.8 or newer) and Node.js (14+) installed. Don't worry, setup is pretty straightforward!

### First, let's get the backend going:

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Then fire up the frontend:

```bash
cd frontend
npm install
npm start
```

Head over to `http://localhost:3000` and you're good to go! 🚀

## How I Built This

I wanted to keep things clean and maintainable, so I split the app into two parts:

**Backend (Python/FastAPI):**
- Grabs data from the mock API
- Crunches numbers to calculate all those juicy metrics
- Serves everything up nice and organized to the frontend

**Frontend (React/TypeScript):**
- Beautiful Material-UI interface (because ugly dashboards are sad)
- Real-time updates every 30 seconds
- Color-coded everything so you can spot issues instantly
- Responsive design that works on any screen

## Cool Features

### Money Talk 💰
All the dollar amounts are properly formatted (like $1,234.56) because who wants to read 1234.5600000001?

### Traffic Light System 🚦
I color-coded everything so you know what's up at a glance:
- 🟢 Green = All good, keep doing what you're doing
- 🟡 Yellow = Hmm, might want to check on this
- 🔴 Red = Houston, we have a problem

### Smart Health Scores
Each store gets a health score (0-100) based on:
- How many orders complete successfully
- How fast orders are getting processed
- Revenue performance
- Overall consistency
- Error patterns

It's like a fitness tracker, but for restaurants!

## The Tech Stack

I went with some solid, battle-tested tools:
- **Backend:** Python with FastAPI (fast and easy to work with)
- **Frontend:** React with TypeScript (because types catch bugs before they bite)
- **UI:** Material-UI (looks professional out of the box)
- **Data:** Axios for API calls (simple and reliable)

## How the Data Flows

1. Mock API has all the raw store and order data
2. My backend fetches that data and does the heavy lifting (calculations, aggregations)
3. Frontend polls the backend every 30 seconds for updates
4. You see beautiful, organized data on your screen

Pretty simple, right?

## What's In The Box

```
📦 The whole project
├── 🐍 backend/          Everything Python
│   └── app/
│       ├── main.py      API endpoints
│       ├── models.py    Data structures
│       └── services.py  Business logic
├── ⚛️  frontend/        Everything React
│   └── src/
│       ├── components/  All the UI pieces
│       ├── services/    API communication
│       └── types.ts     TypeScript definitions
└── 📝 README.md         You are here!
```

## If I Had More Time...

You know how it goes - there's always a wish list:

1. **WebSocket magic** - Push updates instantly instead of polling
2. **Smarter anomaly detection** - Maybe some machine learning to predict issues
3. **Charts and graphs** - Because who doesn't love a good trend line?
4. **Historical data** - See how things have changed over time
5. **User accounts** - So each restaurant manager sees only their stuff
6. **Mobile app** - Check on things from anywhere
7. **Tests** - Because future-me will thank past-me

## Running the Full Stack

You need three things running at once:

```bash
# Tab 1: Start the backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Tab 2: Start the frontend  
cd frontend
npm start

# Tab 3: Mock API (probably already running)
# Should be at http://localhost:3001
```

Then visit `http://localhost:3000` and watch the magic happen! ✨

## A Few Notes

I made some assumptions while building this:
- The mock API returns consistent data formats
- Order statuses are lowercase (completed, failed, etc.)
- Times are in seconds but displayed in minutes (because who counts in seconds?)
- One store view at a time keeps things focused
- 30-second refresh is enough for most use cases


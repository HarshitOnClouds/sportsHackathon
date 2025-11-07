# Quick Start Guide 🚀

Follow these steps to get UK-TalentScout running on your local machine in under 5 minutes!

## Step 1: Prerequisites Check ✅

Make sure you have:
- [ ] Node.js installed (v16 or higher) - Run `node --version` to check
- [ ] MongoDB installed and running - Run `mongod --version` to check
- [ ] Git installed - Run `git --version` to check

## Step 2: Clone & Install 📥

```bash
# Clone the repository
git clone https://github.com/HarshitOnClouds/sportsHackathon.git
cd sportsHackathon

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 3: Setup Environment Variables 🔧

### Backend (.env file)

```bash
# Navigate to backend folder
cd backend

# Copy the example file
copy .env.example .env

# Edit .env file with your settings
```

Your `backend/.env` should look like:
```env
PORT=3001
MONGO_URL_LOCAL=mongodb://localhost:27017/sportsHackathon
```

### Frontend (.env file)

```bash
# Navigate to frontend folder
cd ../frontend

# Copy the example file
copy .env.example .env
```

Your `frontend/.env` should look like:
```env
VITE_API_URL=http://localhost:3001
```

## Step 4: Start MongoDB 🍃

```bash
# On Windows (if installed as service)
net start MongoDB

# Or run mongod directly
mongod

# MongoDB should now be running on port 27017
```

## Step 5: Start the Backend Server 🖥️

```bash
# In the backend folder
cd backend
npm start

# You should see:
# "MongoDB Connected successfully!"
# "Server running on http://localhost:3001"
```

## Step 6: Start the Frontend 🎨

Open a **new terminal** window:

```bash
# In the frontend folder
cd frontend
npm run dev

# You should see:
# "Local: http://localhost:5173"
```

## Step 7: Open the App 🌐

Open your browser and go to:
```
http://localhost:5173
```

## Step 8: Create Your First Account 👤

1. Click **"Create Profile"** on the homepage
2. Choose **Athlete** or **Coach**
3. Fill in the form
4. Click **"Sign Up"**
5. You're in! 🎉

---

## Common Issues & Solutions 🔧

### Issue: "MongoDB connection failed"
**Solution**: Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongo --eval "db.version()"

# If not, start it
mongod
```

### Issue: "Port 3001 already in use"
**Solution**: Kill the process or change the port
```bash
# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in backend/.env to 3002
```

### Issue: "Cannot find module"
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Frontend not connecting to backend
**Solution**: Check CORS and environment variables
1. Verify backend is running on port 3001
2. Check `VITE_API_URL` in frontend/.env
3. Backend should have `app.use(cors())` enabled

---

## Testing the Application 🧪

### Test as an Athlete:
1. Sign up as an athlete
2. Log a performance (e.g., "100m Time")
3. View your profile with the chart
4. Export your data as CSV
5. Edit your profile

### Test as a Coach:
1. Sign up as a coach
2. Browse athletes on the dashboard
3. Filter by sport/district/age
4. Click on an athlete to view their performance
5. Toggle between dark/light mode

---

## Next Steps 📚

- Read the full [README.md](README.md) for detailed documentation
- Explore the [API endpoints](README.md#api-endpoints)
- Check out the [project structure](README.md#project-structure)
- Learn about [available features](README.md#features)

---

**Need help?** Open an issue on GitHub or contact the development team.

**Happy Coding! 💻**

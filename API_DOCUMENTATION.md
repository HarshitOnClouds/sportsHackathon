# API Documentation 📚

Complete API reference for UK-TalentScout backend.

**Base URL**: `http://localhost:3001`

---

## Authentication 🔐

Currently, the API uses simple authentication without JWT tokens. Passwords are hashed using bcrypt before storage.

---

## User Endpoints 👤

### 1. Register User

Create a new athlete or coach account.

**Endpoint**: `POST /api/users/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "athlete",
  "sport": "Athletics (Sprinting)",
  "district": "Dehradun",
  "age": 18
}
```

**For Coach**:
```json
{
  "name": "Coach Smith",
  "email": "coach@example.com",
  "password": "password123",
  "role": "coach",
  "district": "Haridwar",
  "team": "Uttarakhand Sports Academy"
}
```

**Response** (201 Created):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "athlete",
  "sport": "Athletics (Sprinting)",
  "district": "Dehradun",
  "age": 18
}
```

**Validation Rules**:
- Name: Required
- Email: Required, must be unique
- Password: Required, minimum 6 characters
- Role: Required, must be "athlete" or "coach"
- District: Required
- Sport & Age: Required for athletes
- Team: Required for coaches
- Sport cannot be "Select a Sport"

---

### 2. Login User

Authenticate and login a user.

**Endpoint**: `POST /api/users/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "athlete",
  "sport": "Athletics (Sprinting)",
  "district": "Dehradun",
  "age": 18
}
```

**Error Response** (401 Unauthorized):
```json
{
  "message": "Invalid email or password"
}
```

---

### 3. Get All Athletes

Retrieve list of athletes with optional filters.

**Endpoint**: `GET /api/users/athletes`

**Query Parameters**:
- `sport` (optional): Filter by sport
- `district` (optional): Filter by district
- `age` (optional): Filter by maximum age

**Examples**:
```
GET /api/users/athletes
GET /api/users/athletes?sport=Cricket
GET /api/users/athletes?district=Dehradun
GET /api/users/athletes?sport=Football&age=20
```

**Response** (200 OK):
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "athlete",
    "sport": "Athletics (Sprinting)",
    "district": "Dehradun",
    "age": 18
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "athlete",
    "sport": "Cricket",
    "district": "Nainital",
    "age": 19
  }
]
```

---

### 4. Get User by ID

Retrieve a specific user's profile.

**Endpoint**: `GET /api/users/:id`

**Example**:
```
GET /api/users/507f1f77bcf86cd799439011
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "athlete",
  "sport": "Athletics (Sprinting)",
  "district": "Dehradun",
  "age": 18
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "User not found"
}
```

---

### 5. Update User Profile

Update user information.

**Endpoint**: `PUT /api/users/:id`

**Request Body** (Athlete):
```json
{
  "name": "John Updated",
  "district": "Haridwar",
  "sport": "Football",
  "age": 19
}
```

**Request Body** (Coach):
```json
{
  "name": "Coach Updated",
  "district": "Dehradun",
  "team": "New Team Name"
}
```

**Response** (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Updated",
  "email": "john@example.com",
  "role": "athlete",
  "sport": "Football",
  "district": "Haridwar",
  "age": 19
}
```

**Validation**:
- Sport cannot be "Select a Sport"
- All fields are optional (only update provided fields)

---

## Performance Endpoints 📊

### 1. Log Performance

Create a new performance record for an athlete.

**Endpoint**: `POST /api/performance`

**Request Body**:
```json
{
  "athleteId": "507f1f77bcf86cd799439011",
  "metricName": "100m Time",
  "metricValue": 11.5,
  "metricUnit": "seconds",
  "notes": "Personal best!"
}
```

**Response** (201 Created):
```json
{
  "_id": "607f1f77bcf86cd799439022",
  "athleteId": "507f1f77bcf86cd799439011",
  "metricName": "100m Time",
  "metricValue": 11.5,
  "metricUnit": "seconds",
  "notes": "Personal best!",
  "date": "2025-11-07T10:30:00.000Z",
  "createdAt": "2025-11-07T10:30:00.000Z"
}
```

**Validation Rules**:
- athleteId: Required, must be a valid athlete
- metricName: Required, cannot be "Select a Metric"
- metricValue: Required, must be a number
- metricUnit: Required, cannot be "Select Unit"
- notes: Optional
- date: Optional (defaults to current date)

---

### 2. Get Athlete Performance

Retrieve all performance records for a specific athlete.

**Endpoint**: `GET /api/performance/athlete/:athleteId`

**Example**:
```
GET /api/performance/athlete/507f1f77bcf86cd799439011
```

**Response** (200 OK):
```json
[
  {
    "_id": "607f1f77bcf86cd799439022",
    "athleteId": "507f1f77bcf86cd799439011",
    "metricName": "100m Time",
    "metricValue": 11.5,
    "metricUnit": "seconds",
    "notes": "Personal best!",
    "date": "2025-11-07T10:30:00.000Z",
    "createdAt": "2025-11-07T10:30:00.000Z"
  },
  {
    "_id": "607f1f77bcf86cd799439023",
    "athleteId": "507f1f77bcf86cd799439011",
    "metricName": "100m Time",
    "metricValue": 11.8,
    "metricUnit": "seconds",
    "notes": "Training session",
    "date": "2025-11-05T10:30:00.000Z",
    "createdAt": "2025-11-05T10:30:00.000Z"
  }
]
```

**Note**: Results are sorted by date (newest first)

---

### 3. Delete Performance

Delete a specific performance record.

**Endpoint**: `DELETE /api/performance/:id`

**Example**:
```
DELETE /api/performance/607f1f77bcf86cd799439022
```

**Response** (200 OK):
```json
{
  "message": "Performance record deleted successfully"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "Performance record not found"
}
```

---

## Error Responses ❌

All endpoints may return these common error responses:

### 400 Bad Request
```json
{
  "message": "Please fill in all required fields"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server Error",
  "error": "Detailed error message"
}
```

---

## Data Models 📋

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  role: String (required, enum: ['athlete', 'coach']),
  district: String (required),
  
  // Athlete only
  sport: String (required if athlete),
  age: Number (required if athlete),
  
  // Coach only
  team: String (required if coach)
}
```

### Performance Model

```javascript
{
  athleteId: ObjectId (required, ref: 'User'),
  metricName: String (required),
  metricValue: Number (required),
  metricUnit: String (required),
  date: Date (default: now),
  notes: String (optional),
  createdAt: Date (auto)
}
```

---

## Rate Limiting 🚦

Currently, there is no rate limiting implemented. In production, consider adding:
- Request limits per IP/user
- Authentication tokens with expiration
- API key requirements

---

## CORS Configuration 🌐

CORS is enabled for all origins in development:

```javascript
app.use(cors());
```

In production, restrict to your frontend domain:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

---

## Security Considerations 🔒

### Current Implementation:
- ✅ Password hashing with bcrypt
- ✅ Input validation (frontend + backend)
- ✅ Error handling
- ✅ MongoDB injection prevention (via Mongoose)

### Recommendations for Production:
- [ ] Add JWT authentication
- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Use HTTPS
- [ ] Add request logging
- [ ] Implement role-based access control
- [ ] Add API versioning
- [ ] Set up monitoring and alerts

---

## Testing the API 🧪

### Using cURL:

**Register User**:
```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "athlete",
    "sport": "Football",
    "district": "Dehradun",
    "age": 20
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Athletes**:
```bash
curl http://localhost:3001/api/users/athletes
```

### Using Postman:

1. Import the API endpoints
2. Set base URL to `http://localhost:3001`
3. Use JSON format for request bodies
4. Test each endpoint with sample data

---

**For more information, see the main [README.md](README.md)**

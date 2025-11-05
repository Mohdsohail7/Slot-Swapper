# SlotSwapper

**SlotSwapper** is a peer-to-peer time-slot swapping application. Users create calendar events (slots), mark busy slots as `SWAPPABLE`, browse other users' swappable slots, and offer one of their own swappable slots in exchange. Swap requests can be accepted or rejected; an accepted swap atomically exchanges ownership of the two slots.

---

---

## Live Demo (optional)

(Otherwise this section can be left blank or removed.)

---

## Project Overview & Design Choices

**Overview:**  
SlotSwapper is designed to let users swap busy calendar slots without a central arbitrator. The server enforces atomic swaps to prevent race conditions and double-offers.

**Key design choices:**
- **REST API** with JSON Web Tokens (JWT) for authentication (stateless, works well with SPAs).
- **MongoDB + Mongoose** for flexible schema and easy relation modeling (references between `Event` and `User`).
- **Mongoose transactions (sessions)** around swap creation and swap acceptance to ensure atomicity (requires replica set / Atlas).
- **Simple React + Tailwind** frontend: forms for auth, event management (list view), marketplace, and notifications.
- **Minimal calendar UI** (list/grid). The focus is correctness of swap logic; a full calendar UI (FullCalendar) is a future enhancement.

---

## Tech Stack

- Frontend: React, Tailwind CSS, Axios
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Authentication: JWT
- Dev tools: nodemon (backend), Postman for API testing

---

## Repository

> Add your public GitHub repository link here (replace the placeholder):  
`https://github.com/<your-username>/slotswapper`


---

## Getting Started — Local Setup

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account OR a local MongoDB replica-set (for transactions). If you cannot run a replica set locally, the swap transaction code will fall back or you can test without transactions (see notes).

### Environment variables
Create a `.env` file in the `backend` folder with:
PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=generate_a_secure_random_secret_here

REACT_APP_BASE_URL="http://localhost:4000/api


**Generate a strong JWT_SECRET (example commands):**

```bash
# Node
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
## Backend setup
# from repository root
cd backend

# install dependencies
npm install

# start in dev mode (nodemon)
npm start

The server will run on http://localhost:4000 

## Frontend setup
cd frontend
npm install
npm start     

Open http://localhost:3000

## API Endpoints
Auth

| Method |                 Path | Body                        | Description                  |
| ------ | -------------------: | --------------------------- | ---------------------------- |
| POST   | `/api/auth/register` | `{ name, email, password }` | Register user; returns token |
| POST   |    `/api/auth/login` | `{ email, password }`       | Login; returns token         |

Events

| Method       |                     Path | Body                            | Description                                             |
| ------------ | -----------------------: | ------------------------------- | ------------------------------------------------------- |
| GET          |            `/api/events` | —                               | Get current user's events                               |
| POST         |            `/api/events` | `{ title, startTime, endTime }` | Create event                                            |
| PATCH        | `/api/events/:id/status` | `{ status }`                    | Update event status (`BUSY`,`SWAPPABLE`,`SWAP_PENDING`) |
| PUT / DELETE |        `/api/events/:id` | `{...}`                         | Update/Delete event (owner-only)                        |


Swaps

| Method |                                  Path | Body                        | Description                                          |                                                                                                                                        |
| ------ | ------------------------------------: | --------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| GET    |          `/api/swaps/swappable-slots` | —                           | Returns other users' slots with `status: SWAPPABLE`  |                                                                                                                                        |
| POST   |             `/api/swaps/swap-request` | `{ mySlotId, theirSlotId }` | Create swap request; marks both slots `SWAP_PENDING` |                                                                                                                                        |
| POST   | `/api/swaps/swap-response/:requestId` | `{ accept: true             | false }`                                             | Accept/reject a request. If accepted, **owners are exchanged** and statuses set to `BUSY`. If rejected, status returns to `SWAPPABLE`. |
| GET    |                          `/api/swaps` | —                           | Returns user's incoming & outgoing swap requests     |                                                                                                                                        |
postman collecton link below

https://.postman.co/workspace/Backend~192e0456-8de1-4b03-8824-b72c6330eca7/collection/28706994-017a8f27-e801-4869-bad5-a33b8149cda3?action=share&creator=28706994

https://web.postman.co/workspace/Backend~192e0456-8de1-4b03-8824-b72c6330eca7/collection/28706994-017a8f27-e801-4869-bad5-a33b8149cda3?action=share&source=copy-link&creator=28706994




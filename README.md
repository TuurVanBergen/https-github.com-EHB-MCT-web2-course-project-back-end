**Web2 Backend Project - Tuur Van Bergen**
This project is the backend component of the Web2 course final project, focused on providing the API endpoints and database functionality required for a gallery management application. The backend includes full CRUD (Create, Read, Update, Delete) operations for handling galleries, artists, and artwork. It uses Express.js for API routing and MongoDB Atlas for data storage.

**Project Description**
The backend is a Node.js server that interacts with a MongoDB database to manage data related to galleries, artists, and artworks. The server provides REST API endpoints for CRUD operations. Each gallery can have details like title, artist, opening hours, location, and additional links. The backend supports data persistence through MongoDB Atlas.

**Requirements**
Frontend: Hosted on GitHub Pages as a Webpack project.
Backend: Hosted online with MongoDB Atlas as a cloud database, including a full CRUD API.
Git: The Git repository will be evaluated based on contributions made before the final project deadline.

**Setup and Installation**
Node.js (v12 or higher)
MongoDB Atlas account and database

**Steps**
Clone the repository:

bash
git clone https://github.com/TuurVanBergen/Web-1.git
cd Web-1
Install dependencies:

bash
npm install
Configure the .env file: Create a .env file in the root directory and provide the following variables:

makefile
Code kopiëren
PORT=3000
DATABASE_URL=mongodb+srv://username:password@your-cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_secret_key

**Start the server: For development:**

bash
Code kopiëren
npm run dev
For production:

bash
Code kopiëren
npm start
The backend will run on http://localhost:3000.

**Endpoints**
CRUD Routes
/Artist (GET): Fetches all artists from the database.
/Table-of-contents (GET): Fetches all galleries from the database.
/Artwork (GET): Fetches all artworks from the database.
/addGallery (POST): Adds a new gallery to the database.
/deleteGallery (DELETE): Deletes a gallery based on title.
/updateGallery (PUT): Updates an existing gallery’s information based on title.
Sample Request-Response
Example request for adding a new gallery:

json
POST /addGallery
{
  "title": "New Gallery",
  "artist": "John Doe",
  "opening_hours": "10 AM - 6 PM",
  "price": "Free",
  "location": "Brussels",
  "facebook_link": "...",
  "instagram_link": "...",
  "website_link": "...",
  "text_1_title": "Introduction",
  "text_1": "Welcome to the new gallery.",
  "category": "Art"
}
Example response:

json
{
  "message": "Gallery added successfully!"
}

**Technologies Used**
Node.js: JavaScript runtime for backend development
Express.js: Web framework for building RESTful APIs
MongoDB Atlas: Cloud-based database solution for data storage
UUID: For generating unique identifiers for documents
CORS: Middleware for enabling cross-origin requests

**Sources**
Building Web Applications with Node.js and Express on Pluralsight
RESTful API Crash Course - YouTube
MongoDB CRUD Documentation: https://www.mongodb.com/docs/manual/crud/
MongoDB Count Documents: https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/
MongoDB UUID Reference: https://www.mongodb.com/docs/manual/reference/method/UUID/
MongoDB Delete Example: https://www.mongodb.com/docs/drivers/node/current/usage-examples/deleteOne/
MongoDB Update Example: https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
Express Routing: https://expressjs.com/en/starter/basic-routing.html
Web2 Course Material, Videos, and Exercises

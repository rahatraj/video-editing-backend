
#  Video Editing Backend - Node.js Assignment

This project is a backend service that allows users to upload, trim, subtitle, render, and download videos — similar to YouTube’s video processing backend.

---

##  Technologies Used

- Node.js + Express.js
- Prisma ORM + PostgreSQL
- FFmpeg + fluent-ffmpeg
- Multer (for file upload)
- Express-Validator
- Morgan (logging)

---

##  Project Features

    Upload video and extract metadata  
    Trim video using FFmpeg  
    Overlay subtitles with timing  
    Render final video (combined trimmed + subtitle)  
    Download final video  
    List videos  
    Fetch single video details  
    Clean validation and modular structure  

---

##  Folder Structure

src/ ├── controllers/ ├── routes/ ├── middlewares/ ├── validators/ ├── utils/ ├── uploads/ └── app.js server.js prisma/ .env


---

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/video-editing-backend.git
cd video-editing-backend
```


2. **Install dependencies**

 npm install

3. **Set up .env file**

 npx prisma migrate dev --name init

 **Instructions for usage**

    Copy this .env.example → rename to .env
    Fill in your actual PostgreSQL credentials:

    username = "your local PostgreSQL username (e.g., postgres)"

    password = "your PostgreSQL password"

    video_editing = "your database name"

4. **Run Prisma migration**

 npx prisma migrate dev --name init

5. **Start the server**
    
  npm run dev

6. **Test APIs using Postman**

## API Endpoints

| Method |     Endpoint                  | Description                             |
|--------|----------|--------------------|
| POST   | `/api/videos/upload`          | Upload a video file                     |
| POST   | `/api/videos/:id/trim`        | Trim video (startTime, endTime)         |
| POST   | `/api/videos/:id/addsubtitle` | Add subtitle (text, startTime, endTime) |
| POST   | `/api/videos/:id/render`      | Combine trimmed + subtitle              |
| GET    | `/api/videos`                 | List all videos                         |
| GET    | `/api/videos/:id/download`    | Download final rendered video           |
| GET    | `/api/videos/:id`             | Get one video by ID                     |


## Demo Video

Watch the Demo

## Author
MD RAHAT REZA




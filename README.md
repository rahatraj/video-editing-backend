
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

- Upload video and extract metadata 

- Trim video using FFmpeg 

- Overlay subtitles with timing

- Render final video (combined trimmed + subtitle)  

- Download final video  

- List videos  

- Fetch single video details  

- Clean validation and modular structure  

---

##  Folder Structure

video-editing-backend/ ├── prisma/ │ └── schema.prisma ├── src/ │ ├── controllers/ │ ├── middlewares/ │ ├── routes/ │ ├── utils/ │ ├── validators/ │ └── uploads/ │ └── app.js ├── server.js ├── .env.example ├── .gitignore └── README.md


---

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/video-editing-backend.git
cd video-editing-backend
```


2. **Install dependencies**

 npm install

3. **Set up environment variables**

 - Copy .env.example → rename to .env

 - Fill in your PostgreSQL credentials:

    DATABASE_URL=postgresql://<username>:<password>@localhost:5432/video_editing

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

## Note from the Developer

While I chose to complete the Backend task for this assignment,
I also have experience with frontend technologies such as:

- React.js

- Redux ToolKit

- Tailwind CSS

- Responsive design

- REST API integration

I am confident working across the full stack and can build complete applications end-to-end.
For this challenge, I focused deeply on the backend to ensure high-quality delivery, clean architecture, and proper validation.


## Author
MD RAHAT REZA
📧 rahatreza3199@gmail.com
🔗 https://www.github.com/rahatraj
🔗 https://www.linkedin.com/in/md-rahat-reza-57001a1b3/






import path, { dirname } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import sendResponses from '../utils/sendResponses.js';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const videoCltr = {};
const prisma = new PrismaClient();

videoCltr.upload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return sendResponses(res,404,'No file uploaded!');
    }

    const filePath = path.join(__dirname, '../../', file.path);

    ffmpeg.ffprobe(filePath, async (error, metadata) => {
      if (error) {
        console.error('Error probing video', error);
        return sendResponses(res,500,'Something went wrong during probing.')
      }

      const duration = metadata.format.duration;

      const video = await prisma.video.create({
        data: {
          name: file.originalname,
          size: file.size,
          duration: duration,
          path: filePath,
        },
      });
      return sendResponses(res,201,"Video uploaded successfully.", video)
    });

  } catch (error) {
    console.error(error);
    return sendResponses(res,500, "Internal server errors.")
  }
};

videoCltr.trim = async(req,res) => {
  try {
    const id = req.params.id;
    const {startTime, endTime } = req.body;

    if(!startTime || !endTime || startTime >= endTime){
      return sendResponses(res,400, "Start time and End time is required and Start time should not be greater than End time")
    }

    const video = await prisma.video.findUnique({where : { id : parseInt(id)}})
    if(!video){
      return sendResponses(res,404, "Video not found!")
    }
    const trimmedFileName = `${Date.now()}-trimmed-${path.basename(video.path)}`
    const trimmedFilePath = path.join('uploads', trimmedFileName)

    ffmpeg(video.path)
      .setStartTime(startTime)
      .setDuration(endTime - startTime)
      .output(trimmedFilePath)
      .on('end', async() => {
        console.log('Trim successfully')

        await prisma.video.update({
          where : {id : parseInt(id)},
          data : {trimmedPath : `uploads/${trimmedFileName}`}
        })
        
        return res.status(201).json({
          message : 'video trimmed successfully.',
          trimmedPath : trimmedFilePath
        })
      })
      .on('error', (error)=> {
        console.log(`error trimming video ${error}`)
        return sendResponses(res,500, "Error trimming video")
      })
      .run();
  } catch (error) {
    console.error(error)
    return sendResponses(res,500, "Internal server errors")
  }
}

videoCltr.addSubtitle = async(req,res) => {
  try {
    const id = req.params.id;
    const { text, startTime, endTime } = req.body

    if(!text || startTime == null || endTime == null){
      return sendResponses(res,400, "Text, startTime and endTime are required.")
    }
    const video = await prisma.video.findUnique({
      where : {id : parseInt(id)}
    })

    if(!video){
      return sendResponses(res,404, "Video not found!")
    }

    const substitleFileName = `${Date.now()}-subtitle-${path.basename(video.path)}`
    const subtitleFilePath = path.join('uploads', substitleFileName)

    ffmpeg(video.path)
      .videoFilter([
        {
          filter : "drawtext",
          options : {
            fontfile : '/Windows/Fonts/arial.ttf',
            text,
            fontsize : 24,
            fontcolor : 'white',
            x : '(main_w/2-text_w/2)',
            enable : `between(t\\,${startTime}\\,${endTime})`
          }
        }
      ])
      .output(subtitleFilePath)
      .on('end', async() => {
        console.log('Subtitle added successfully.')

        await prisma.video.update({
          where : {id : parseInt(id)},
          data : {
            subtitlePath : subtitleFilePath,
            subtitleText : text,
            subtitleStart : startTime,
            subtitleEnd : endTime
          }
        })
        return sendResponses(res,201,"Subtitle added successfully", {subtitlePath : subtitleFilePath})
      })
      .on('error', (err) => {
        console.log('error adding subtitle : ', err)
        return sendResponses(res,500, "Error adding subtitle")
      })
      .run();

  } catch (error) {
    console.error(error)
    return sendResponses(res,500, "Internal server errors")
  }
}

videoCltr.render = async(req,res) => {
  try {
    const id = req.params.id;

    const video = await prisma.video.findUnique({where : { id : parseInt(id)}})
    if(!video){
      return sendResponses(res,404, "Video not found!")
    }

    let sourcePath = video.path;
    if(video.trimmedPath){
      sourcePath = video.trimmedPath
    }

    if(video.subtitlePath){
      sourcePath = video.subtitlePath
    }

    console.log('Source Path:', sourcePath);

    // Check if the file exists at the source path
    if (!fs.existsSync(sourcePath)) {
      console.log("File does not exist at path:", sourcePath);
      return sendResponses(res, 404, "File not found at the given path.");
    }

    const finalFileName = `${Date.now()}-final-${path.basename(sourcePath)}`
    const finalFilePath = path.join('uploads',finalFileName)

    console.log("finalFilePath", finalFilePath)
    // if both trimmed and subtitle is exist.

    if(video.trimmedPath && video.subtitlePath){
      ffmpeg(video.trimmedPath)
        .videoFilter([
          {
            filter : 'drawtext',
            options : {
              fontfile : '/Windows/Fonts/arial.ttf',
              text : video.subtitleText || 'Default Subtitle',
              fontsize : 24,
              fontcolor : "white",
              x : '(main_w/2-text_w/2)',
              y : '(main_h-text_h-50)',
              enable : `between(t\\,${video.subtitleStart || 0}\\,${video.subtitleEnd || 5})`
            }
          }
        ])
        .output(finalFilePath)
        .on('end', async() => {
          console.log('Final video combined completed')

          await prisma.video.update({
            where : {id : parseInt(id)},
            data : {
              finalPath : finalFilePath,
              status : 'rendered'
            }
          })
          return sendResponses(res,201, "Final combined video rended successfully", {finalPath : finalFilePath})
        })
        .on('error', (err) => {
          console.error('Error combined video', err)
          return sendResponses(res,500,"Error rendering combined final video")
        })
        .run();
    }else {
      ffmpeg(sourcePath)
      .output(finalFilePath)
      .on('end', async() => {
        console.log('final render completed.')

        await prisma.video.update({
          where : {id : parseInt(id)},
          data : {
            finalPath : finalFilePath,
            status : 'rendered'
          }
        })
        return sendResponses(res,200, "Final video rendered successfully",{finalPath : finalFilePath})
      })

      .on('error', (err) => {
        console.log('Error rendering final video', err)
        return sendResponses(res,500,"Error rendering final video")
      })
      .run();
    }
  } catch (error) {
    console.error(error)
    return sendResponses(res,500, "Internal server errors")
  }
}

videoCltr.download = async(req,res) => {
  try {
    const id = req.params.id;

    const video = await prisma.video.findUnique({
      where : {id : parseInt(id)}
    })

    if(!video){
      return sendResponses(res,404,"Video not found!")
    }

    if(video.status !== "rendered" || !video.finalPath){
      return sendResponses(res,400, "Video not yet rendered. Please render first before downlaoding.")
    }

    return res.download(video.finalPath, (err) => {
      if(err){
        console.error("Error downloading video",err)
        return sendResponses(res,500, "Error downloading video.")
      }
    })
  } catch (error) {
    console.error(error)
    return sendResponses(res,500, "Internal server errors.")
  }
}

videoCltr.list = async(req,res) => {
  try {
    const videos = await prisma.video.findMany();
    if(!videos){
      return sendResponses(res,404,'Videos not found!')
    }
    return sendResponses(res,200,'Vides fetched successfully.', videos)
  } catch (error) {
    return sendResponses(res,500,'Internal serve errors')
  }
}

videoCltr.details = async(req,res) => {
  try {
    const id = req.params.id;
    const video = await prisma.video.findUnique({where : {id : parseInt(id)}})
    if(!video){
      return sendResponses(res,404,"Video not found!")
    }
    return sendResponses(res,200,"Video fetched successfully",video)
  } catch (error) {
    return sendResponses(res,500, "Internal server errors.")
  }
}
export default videoCltr;

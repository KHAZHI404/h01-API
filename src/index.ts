import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import { createBrotliDecompress } from 'zlib';
//import { videosRouter } from './routes/videos-router';
/////////////////////////
export const app = express()
const port = 3003

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
export const db: DbType = {
    videos: [
    {
        "id": 0,
        "title": "first video",
        "author": "Leonardo",
        canBeDownloaded: false,
        minAgeRestriction: null,        
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        "availableResolutions": [
            "P144"
        ]
    }
]}
type DbType = {
    videos: VideosType[]
}
export type VideosType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded: boolean,
    minAgeRestriction: number | null,
    createdAt: string,
    publicationDate: string,
    availableResolutions: string[]
}

const parser = bodyParser({})
app.use(parser)

const resolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ]

export const validateResolutions = (inputResolutions: string[]) => {    
    if (!inputResolutions || inputResolutions.length > resolutions.length || typeof inputResolutions !== 'object' ) {
        return true
    }

    try {
        for (const el of inputResolutions){
            if (!resolutions.includes(el)) return true
        }
    } catch (error) {
        return true
    }

    return null
}

///////////////////////////////
app.delete('/testing/all-data', (req, res) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}) 
app.get('/videos', (req: Request, res: Response) => {
    
    return res.status(HTTP_STATUSES.OK_200).send(db.videos)
    
})
app.post('/videos', (req: Request, res: Response) => {
    try {
        const title = req.body.title
        const author = req.body.author
        const availableResolutions = req.body.availableResolutions
        const errors = []
    
    
        if (!title || title.length > 40 || typeof title !== 'string') {
            errors.push({message: 'errors in title', field: 'title'})
        }
    
        if (!author || author.length > 20 || typeof author !== 'string') {
            errors.push({message: 'errors in author', field: 'author'})
        }
        
        if (validateResolutions(availableResolutions)) {
            errors.push({message: 'errors in availableResolutions', field: 'availableResolutions'})
        }
        
    
        if(errors.length){
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errors})
        }
                
        const newVideo: VideosType = {
                id: +(new Date()),
                title: title,
                author: author,
                canBeDownloaded: false,
                minAgeRestriction: null,
                createdAt: new Date().toISOString(),
                publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
                availableResolutions: availableResolutions,
            }
    
        db.videos.push(newVideo)
        
        return res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
    } catch (e) {
            console.log(e);
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId
    const video = db.videos.find(v => v.id === id)
    if(!video) {
        return res.send(HTTP_STATUSES.NOT_FOUND_404)
    } else {
        return res.status(HTTP_STATUSES.OK_200).send(video)
    }
}) 
app.put('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId
    const title = req.body.title
    const author = req.body.author
    const errors = []

    if (!title || title.length > 40 || typeof title !== 'string') {
        errors.push({message: 'errors in title', field: 'title'})
    }

    if (!author || author.length > 20 || typeof author !== 'string') {
        errors.push({message: 'errors in author', field: 'author'})
    }

    if (errors.length) {
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errors})
    }


    const video = db.videos.find(v => v.id === id)
    if (!video) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    } else {
        video.title = req.body.title
        video.author = req.body.author
        video.availableResolutions = req.body.availableResolutions
        return res.status(HTTP_STATUSES.NO_CONTENT_204).send(video)

    }
})
app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId
    for (let i = 0; i < db.videos.length; i++) {
        if(db.videos[i].id === id) {
            db.videos.splice(i, 1);
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    return res.status(HTTP_STATUSES.NOT_FOUND_404).send('request is invalid')
}) 

//app.use('/videos', videosRouter)


///////////////////////////////
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


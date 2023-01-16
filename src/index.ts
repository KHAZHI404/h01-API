import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import { createBrotliDecompress } from 'zlib';
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

export const db = {
    videos: [
    {
        "id": 0,
        "title": "first video",
        "author": "Leonardo",
        "availableResolutions": [
            "P144"
        ]
    },
    {
        "id": 1,
        "title": "second video",
        "author": "Ernesto",
        "availableResolutions": [
            "P240"
        ]
    },
    {
        "id": 3,
        "title": "third video",
        "author": "Mikilianjelo",
        "availableResolutions": [
            "P360"
        ]
    }
]
}


const parser = bodyParser({})
app.use(parser)

const resolutions = [ 'P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160' ]

///////////////////////////////
app.delete('/__test__/data', (req, res) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
}) //////этот эндпоинт обнуляет массив для тестов?


app.get('/videos', (req: Request, res: Response) => {
    
    return res.status(HTTP_STATUSES.OK_200).send(db.videos)
    
}) // в сваггере есть только один возможный респонс, и в то же время обязательны тайтл и автор как это?

app.post('/videos', (req: Request, res: Response) => {
    const title = req.body.title
    const author = req.body.author
    const errors = []


    if (!title || title.length > 40 || typeof title !== 'string') {
        errors.push({message: 'errors in title', field: 'title'})
        }

    if (!author || author.length > 20 || typeof author !== 'string') {
        errors.push({message: 'errors in author', field: 'author'})
        }

        if(errors.length){
            return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        }
            
        const newVideo = {
            id: +(new Date()),
            title: title,
            author: author,
            availableResolutions: [
            "P144" // есть массив этих енамов, как сделать так чтобы пользователь мог задавать только их?
        ] }

        db.videos.push(newVideo)
    
        res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
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
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        }

    if (!author || author.length > 20 || typeof author !== 'string') {
        errors.push({message: 'errors in author', field: 'author'})
        return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        }
        

    const video = db.videos.find(v => v.id === id)
    if (!video) {
        return res.send(HTTP_STATUSES.BAD_REQUEST_400).send('request is invalid')
    } else {
        video.title = req.body.title
        video.author = req.body.author
        video.availableResolutions = req.body.availableResolutions
        return res.status(HTTP_STATUSES.OK_200).send(video)
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

///////////////////////////////
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

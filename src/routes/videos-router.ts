// import {Request, Response, Router, } from "express";
// import {validateResolutions, VideosType, HTTP_STATUSES, db} from "../.";

// export const videosRouter = Router({})




// videosRouter.get('/', (req: Request, res: Response) => {
    
//     return res.status(HTTP_STATUSES.OK_200).send(db.videos)
    
// })
// videosRouter.post('/', (req: Request, res: Response) => {
//     try {
//         const title = req.body.title
//         const author = req.body.author
//         const availableResolutions = req.body.availableResolutions
//         const errors = []
    
    
//         if (!title || title.length > 40 || typeof title !== 'string') {
//             errors.push({message: 'errors in title', field: 'title'})
//         }
    
//         if (!author || author.length > 20 || typeof author !== 'string') {
//             errors.push({message: 'errors in author', field: 'author'})
//         }
        
//         if (validateResolutions(availableResolutions)) {
//             errors.push({message: 'errors in availableResolutions', field: 'availableResolutions'})
//         }
        
    
//         if(errors.length){
//             return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errors})
//         }
                
//         const newVideo: VideosType = {
//                 id: +(new Date()),
//                 title: title,
//                 author: author,
//                 canBeDownloaded: false,
//                 minAgeRestriction: null,
//                 createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
//                 publicationDate: new Date().toISOString(),
//                 availableResolutions: availableResolutions,
//             }
    
//         db.videos.push(newVideo)
        
//         return res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
//     } catch (e) {
//             console.log(e);
//             return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
//     }
// })
// videosRouter.get('/:videoId', (req: Request, res: Response) => {
//     const id = +req.params.videoId
//     const video = db.videos.find(v => v.id === id)
//     if(!video) {
//         return res.send(HTTP_STATUSES.NOT_FOUND_404)
//     } else {
//         return res.status(HTTP_STATUSES.OK_200).send(video)
//     }
// }) 
// videosRouter.put('/:videoId', (req: Request, res: Response) => {
//     const id = +req.params.videoId
//     const title = req.body.title
//     const author = req.body.author
//     const errors = []

//     if (!title || title.length > 40 || typeof title !== 'string') {
//         errors.push({message: 'errors in title', field: 'title'})
//     }

//     if (!author || author.length > 20 || typeof author !== 'string') {
//         errors.push({message: 'errors in author', field: 'author'})
//     }

//     if (errors.length) {
//         return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages: errors})
//     }


//     const video = db.videos.find(v => v.id === id)
//     if (!video) {
//         return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     } else {
//         video.title = req.body.title
//         video.author = req.body.author
//         video.availableResolutions = req.body.availableResolutions
//         return res.status(HTTP_STATUSES.OK_200).send(video)

//     }
// })
// videosRouter.delete('/:videoId', (req: Request, res: Response) => {
//     const id = +req.params.videoId
//     for (let i = 0; i < db.videos.length; i++) {
//         if(db.videos[i].id === id) {
//             db.videos.splice(i, 1);
//             return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//         }
//     }
//     return res.status(HTTP_STATUSES.NOT_FOUND_404).send('request is invalid')
// }) 
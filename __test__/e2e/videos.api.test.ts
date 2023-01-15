import request from 'supertest'
import {app, HTTP_STATUSES, videos} from "../../src";

describe('/videos', () => {

    it('should return 200 and empty array', async () => { //!!! почему EMPTY ARRAY
        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [videos])
    })

    it('should return 201 and create new post', async () => {
        await request(app)
            .post('/videos/videoId')
            .expect(HTTP_STATUSES.CREATED_201)
    })

    it('should return 201 and create new post', async () => {
        await request(app)
            .put('/videos/videoId')
            .expect(HTTP_STATUSES.OK_200)
    })
    
    it('should return 201 and create new post', async () => {
        await request(app)
            .delete('/videos/videoId')
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

})
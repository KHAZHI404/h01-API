import request from 'supertest'
import {app, HTTP_STATUSES, db} from "../../src";

describe('/videos', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () => { 
        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    }) 

    it('should return 404 if not videos', async () => {
        await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.NOT_FOUND_404, [])
    }) //когда сделал тест на получение объекта есть ли смысл делать тест на ошибку при получении?
    //как такой

    it(`should'nt create course with incorrect input data`, async () => {
        await request(app)
            .post('/videos/:videoId')
            .send({ title: ''}) //что значит этот сенд? 
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

            await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [])
    }) 
    
    let createdVideo: any = null // непонятно почему вынесли эту переменную при апдайте
    it('should return 201 and create new post', async () => {
        const createVideo = await request(app)
            .post('/videos/:videoId')
            .send({ title: 'new Title', author: 'new author'})
            .expect(HTTP_STATUSES.CREATED_201)

            const createdVideo = createVideo.body;

            expect(createdVideo).toEqual({
                id: expect.any(Number),
                title: 'new Title',
                author: 'new author'
            })

            await request(app)
            .get('/videos')
            .expect(HTTP_STATUSES.OK_200, [createdVideo])


    })

    it(`should'nt update videos with incorrect input data`, async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({ title: '', author: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

            await request(app)
            .get('/videos' + createdVideo.id)
            .expect(HTTP_STATUSES.OK_200, createdVideo)


    })

    it(`should'nt update videos that not exist`, async () => {
        await request(app)
            .put('/videos/' + -4)
            .send({ title: 'any title', author: 'any author'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should with correct input data`, async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({ title: 'any new title', author: 'any new author'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/videos' + createdVideo.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdVideo,
                title: 'any new title',
                author: 'any new author'
            })
})

it(`should with correct input data`, async () => {
    await request(app)
        .put('/videos/' + createdVideo.id)
        .send({ title: 'any new title', author: 'any new author'})
        .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
        .get('/videos' + createdVideo.id)
        .expect(HTTP_STATUSES.OK_200, {
            ...createdVideo,
            title: 'any new title',
            author: 'any new author'
        })
})

it(`should delete videos`, async () => {
    await request(app)
        .delete('/videos/' + createdVideo.id)
        .expect(HTTP_STATUSES.NO_CONTENT_204)

    await request(app)
        .get('/videos')
        .expect(HTTP_STATUSES.OK_200, [])
})

})
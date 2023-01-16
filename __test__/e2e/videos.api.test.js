"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
describe('/videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete('/__test__/data');
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(src_1.HTTP_STATUSES.OK_200, []);
    }));
    it('should return 404 if not videos', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404, []);
    })); //когда сделал тест на получение объекта есть ли смысл делать тест на ошибку при получении?
    //как такой
    it(`should'nt create course with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .post('/videos/:videoId')
            .send({ title: '' }) //что значит этот сенд? 
            .expect(src_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(src_1.HTTP_STATUSES.OK_200, []);
    }));
    let createdVideo = null; // непонятно почему вынесли эту переменную при апдайте
    it('should return 201 and create new post', () => __awaiter(void 0, void 0, void 0, function* () {
        const createVideo = yield (0, supertest_1.default)(src_1.app)
            .post('/videos/:videoId')
            .send({ title: 'new Title', author: 'new author' })
            .expect(src_1.HTTP_STATUSES.CREATED_201);
        const createdVideo = createVideo.body;
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'new Title',
            author: 'new author'
        });
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(src_1.HTTP_STATUSES.OK_200, [createdVideo]);
    }));
    it(`should'nt update videos with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put('/videos/' + createdVideo.id)
            .send({ title: '', author: '' })
            .expect(src_1.HTTP_STATUSES.BAD_REQUEST_400);
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos' + createdVideo.id)
            .expect(src_1.HTTP_STATUSES.OK_200, createdVideo);
    }));
    it(`should'nt update videos that not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put('/videos/' + -4)
            .send({ title: 'any title', author: 'any author' })
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it(`should with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put('/videos/' + createdVideo.id)
            .send({ title: 'any new title', author: 'any new author' })
            .expect(src_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos' + createdVideo.id)
            .expect(src_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdVideo), { title: 'any new title', author: 'any new author' }));
    }));
    it(`should with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .put('/videos/' + createdVideo.id)
            .send({ title: 'any new title', author: 'any new author' })
            .expect(src_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos' + createdVideo.id)
            .expect(src_1.HTTP_STATUSES.OK_200, Object.assign(Object.assign({}, createdVideo), { title: 'any new title', author: 'any new author' }));
    }));
    it(`should delete videos`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .delete('/videos/' + createdVideo.id)
            .expect(src_1.HTTP_STATUSES.NO_CONTENT_204);
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(src_1.HTTP_STATUSES.OK_200, []);
    }));
});

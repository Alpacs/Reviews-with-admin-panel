const Router = require('express')
const { json } = require('express/lib/response')
const ReviewRouter = new Router()
const reviewController = require('../controller/review.controller')

ReviewRouter.post('/add_review', reviewController.add_review) // добавить отзыв
ReviewRouter.post('/get_review', reviewController.get_review) // получить отзывы по точке питания
ReviewRouter.post('/get_number_reviews', reviewController.getNumberReviews)
ReviewRouter.post('/deleteReview', reviewController.deleteReview)
ReviewRouter.post('/checkReview', reviewController.checkReviewToTwice)

module.exports = ReviewRouter
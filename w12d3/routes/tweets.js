const express = require("express");
const db = require("../db/models");
const { Tweet } = db;
const { asyncHandler} = require('../utils');
const { check, validationResult } = require('express-validator');

const router = express.Router()

let tweetNotFoundError = (tweetId) => {
    let error = new Error(`The tweet of ${tweetId} could not be found.`)
    error.title = "Tweet not found"
    error.status = 404
    return error;
}

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
};

const tweetValidators = [
  check('message')
    .exists({ checkFalsey: true })
    .withMessage('Please provide a value for Message')
    .isLength({ max: 280 })
    .withMessage('Title must not be more than 280 characters long')]

router.get("/", asyncHandler(async(req, res) => {
    const tweets = await Tweet.findAll()
  res.json({tweets});
}));

router.get("/:id(\\d+)", asyncHandler(async(req, res, next) => {
    const tweetId = req.params.id
    const tweet = await Tweet.findByPk(tweetId)
    if (tweet) {
        res.json({tweet});
    } else {
        next(tweetNotFoundError(tweetId));
    }  
}));

router.post("/", tweetValidators, handleValidationErrors, asyncHandler(async(req,res,next) => {
    const {message} = req.body
    let tweet = await Tweet.create({message});
    return res.json({tweet})
}));

router.put("/:id(\\d+)", tweetValidators, handleValidationErrors, asyncHandler(async(req,res,next) => {
    const tweetId = req.params.id
    const newMessage = req.body.message
    const oldTweet = await Tweet.findByPk(tweetId)
    if (oldTweet) {
        await oldTweet.update({message: newMessage})
        res.json({oldTweet})
    } else {
        next(tweetNotFoundError(tweetId));
    }  
}))

router.delete("/:id(\\d+)", tweetValidators, handleValidationErrors, asyncHandler(async(req,res,next) => {
    let id = req.params.id
    let tweet = await Tweet.findByPk(id)
    if(tweet) {
        await tweet.destroy()
        res.status(204).end()
    } else {
        next(tweetNotFoundError(id));
    }
}))




module.exports = router;
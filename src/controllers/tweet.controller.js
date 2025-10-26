import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Tweet content is required");
  }
  try {
    const tweet = new Tweet({ content, author: req.user._id });
    await tweet.save();
    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));
  } catch (error) {
    throw new ApiError(400, "Error to create new field");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const tweets = await user.find({ author: userId }).sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
  } catch (error) {
    throw new ApiError(400, "Error in fetching user tweets");
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      { content },
      { new: true, runValidators: true } //return updated document
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    throw new ApiError(400, "Error in updating tweet");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  try {
    const existingTweet = await Tweet.findById(tweetId); //.findByIdAndDelete(tweetId)
    if (!existingTweet) {
      throw new ApiError("Tweet doesn't exist");
    } else {
      await Tweet.deleteOne({ _id: tweetId });
      return res
        .status(200)
        .json(new ApiResponse(200, "Tweet deleted successfully"));
    }
  } catch (error) {
    throw new ApiError(400, "Error in deleting tweet");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

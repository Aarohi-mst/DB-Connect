import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;
  //TODO: toggle like on video
  try {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video ID");
    }
    const existingLike = await Like.findOne({ user: userId, video: videoId });
    if (existingLike) {
      await Like.deleteOne(existingLike._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Video unliked successfully"));
    } else {
      await Like.create({ videoId, userId });
      return res
        .status(200)
        .json(new ApiResponse(200, "Video liked successfully"));
    }
  } catch (error) {
    throw new ApiError(400, "Failed to toggle like on video");
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  //TODO: toggle like on comment
  try {
    if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "Invalid comment Id");
    }
    const existingComment = await Comment.findOne({
      user: userId,
      comment: commentId,
    });
    if (existingComment) {
      await Comment.deleteOne(existingComment._id);
      return res.ApiResponse(200, "Comment like deleted successfully");
    } else {
      await Comment.create({ commentId, userId });
    }
  } catch (error) {
    throw new ApiError(400, "Failed to toggle like on comment");
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user._id;
  //TODO: toggle like on tweet
  try {
    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid comment Id");
    }
    const existingTweetLike = await Tweet.findOne({
      user: userId,
      tweet: tweetId,
    });
    if (existingTweetLike) {
      await Tweet.deleteOne(existingTweetLike._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Tweet like deleted successfully"));
    } else {
      await Tweet.create({ tweetId, userId });
      return res
        .status(200)
        .json(new ApiResponse(200, "Tweet liked successfully"));
    }
  } catch (error) {
    throw new ApiError(400, "Failed to toggle like on tweet");
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;
  const existingLike = await Like.find({ user: userId }).select("video");
  const likedVideosId = existingLike.map((like) => like.video);
  const likedVideos = (
    await Video.find({ _id: { $in: likedVideosId } })
  ).toSorted({ createdAt: -1 });
  return res.status(200).json(new ApiResponse(200, likedVideos, "Success"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

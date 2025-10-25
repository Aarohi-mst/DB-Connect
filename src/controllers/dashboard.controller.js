import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStatus = asyncHandler(async (req, res) => {
  // TODO: Get the channel status like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params;
  try {
    const totalVideos = await Video.countDocuments({
      channelId,
    });
    const viewsData = await Video.aggregate([
      { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } }, //id: null specifies not to separate everything and treat all as 1 identity for for different videos on same channel
    ]);
    const totalViews = viewsData[0]?.totalViews || 0;
    const likesData = await Like.aggregate([
      { $match: { channelId: mongoose.Types.ObjectId(channelId) } },
      { $group: { _id: null, totalLikes: { $sum: "$likes" } } },
    ]);
    const totalLikes = likesData[0]?.totalLikes || 0;
    const totalSubscribers = await Subscription.countDocuments({
      channelId,
    });
    return res.status(200).json(
      new ApiResponse(200, "Channel status fetched successfully", {
        totalVideos,
        totalViews,
        totalLikes,
        totalSubscribers,
      })
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching channel status");
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  try {
    const videos = await Video.find({ owner: channelId }).sort({
      createdAt: -1, // -1 represents descending order while 1 represents ascending order
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Channel videos fetched successfully", { videos })
      );
  } catch (error) {
    throw new ApiError(500, "Error fetching channel videos");
  }
});

export { getChannelStatus, getChannelVideos };

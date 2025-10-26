import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { userId } = req.params;
  // TODO: toggle subscription
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  try {
    const existingSubscription = await Subscription.findById({
      user: userId,
      channel: channelId,
    });
    if (existingSubscription) {
      await Subscription.deleteOne(existingSubscription._id);
      return res
        .status(200)
        .json(new ApiResponse(200, "Subscription cancelled successfully"));
    } else {
      await Subscription.create({ channelId, userId });
      return res
        .status(200)
        .json(new ApiResponse(200, "Subscription done successfully"));
    }
  } catch (error) {
    throw new ApiError(400, "Error to toggle subscription");
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    //helps to replace user with complete doc but only include name and email
    "user",
    "name email"
  );
  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });
  return res
    .status(200)
    .json(
      200,
      { subscriberCount, subscribers },
      "Subscribers and their count fetched successfully"
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  try {
    const channelCount = await Subscription.countDocuments(subscriberId);
    const channelList = await Subscription.find({
      subscriber: subscriberId,
    }).populate("user", "name email");
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { channelCount, channelList },
          "Channel list and count fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, "Error in fetching channels list");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

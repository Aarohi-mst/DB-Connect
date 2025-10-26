import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" }; //regex refers to regular expression and option i represents case-insensitivity
  }
  if (userId) {
    filter.author = userId;
  }
  const sort = {};
  sort[sortBy] = sortType === "asc" ? 1 : -1;
  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Video.countDocuments(filter);
  return res.status(200).json({
    success: true,
    videos,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    message: "Videos fetched successfully",
  });
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const file = req.file;
  if (!title || !description || !file) {
    throw new ApiError(400, "All fields are required");
  }
  const cloudResult = await uploadOnCloudinary(file.path, {
    resourse_type: "video",
    folder: "videos",
  });
  const video = await Video.create({
    title,
    description,
    url: cloudResult.secure_url,
    publicId: cloudResult.public_id,
    author: req.user._id,
  });
  return res.status(200).json(200, video, "Video published successfully");
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  //TODO: get video by id
  const video = await Video.findById(videoId).populate(
    "author",
    "name username"
  );
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, thumbnail } = req.body;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  //TODO: update video details like title, description, thumbnail
  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    { title, description, thumbnail },
    { new: true, runValidators: true }
  ); //id, updateObject, options
  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  //TODO: delete video
  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(400, "No video found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        video,
        `Video ${video.isPublished ? "published" : "unpublished"} successfully`
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

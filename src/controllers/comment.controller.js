import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  try {
    const comments = await Comment.find({
      videoId: mongoose.Types.ObjectId(videoId),
    });
    return res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Error fetching comments"));
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  try {
    const commentsAdd = new Comment(videoId, req.body);
    await commentsAdd.save();
    return res
      .status(201)
      .json(new ApiResponse(201, commentsAdd, "Comments added successfully "));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Error adding comments"));
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  try {
    const comment = await Comment.findByIdAndUpdate(commentId, req.body, {
      // syntax- id, update field, new
      new: true, // new helps to return updated field else findByIdAndUpdate returns old values only
    });
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comments updated successfully"));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Error updating comments"));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(commentId);
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comments deleted successfully"));
  } catch (error) {
    return res.status(400).json(new ApiError(400, "Error deleting comments"));
  }
});

export { getVideoComments, addComment, updateComment, deleteComment };

import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist
  try {
    const playlist = new Playlist({ name, description });
    await playlist.save();
    return res
      .status(201)
      .json(new ApiResponse(201, playlist, "New playlist create"));
  } catch (error) {
    throw new ApiError(400, "Error in creating new playlist");
  }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  try {
    const userPlaylist = await Playlist.findById(userId);
    return res
      .status(200)
      .json(
        new ApiResponse(200, userPlaylist, "User playlist fetched successfully")
      );
  } catch (error) {
    throw new ApiError(400, "Error in fetching user playlist");
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  try {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    return res.status(200).json(200, playlist, "Playlist fetched successfully");
  } catch (error) {
    throw new ApiError(400, "Unable to fetch playlist");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  try {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    if (playlist.videos.includes(videoId)) {
      throw new ApiError(400, "Video already exists");
    }
    playlist.videos.push(videoId);
    await playlist.save();
    return res
      .status(200)
      .json(
        new ApiResponse(200, playlist, "Video added successfully to playlist")
      );
  } catch (error) {
    throw new ApiError(400, "Unable to add video to playlist");
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  try {
    if (!mongoose.isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    if (!playlist.videos.includes(videoId)) {
      throw new ApiError(400, "Video doesn't exist");
    }
    if (playlist.videos.include(videoId)) {
      Playlist.deleteOne(videoId);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Video removed from playlist successfully"));
  } catch (error) {
    throw new ApiError(400, "Error in removing video");
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  try {
    const playlist = await Playlist.findByIdAndDelete(playlistId); //.deleteOne({ _id: playlistId });
    return res
      .status(200)
      .json(new ApiResponse(200, "Playlist deleted successfully"));
  } catch (error) {
    throw new ApiError(400, "Error in deleting playlist");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  try {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    if (name !== undefined) {
      playlist.name = name;
    }
    if (description !== undefined) {
      playlist.description = description;
    }
    await playlist.save();
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
  } catch (error) {
    throw new ApiError(400, "Error in updating playlist");
  }
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};

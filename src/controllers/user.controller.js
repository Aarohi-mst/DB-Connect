import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnClodinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { username, email, fullName, password } = req.body;
  console.log("data:", username);
  // validation- not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user already exists: username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this username or email");
  }
  // check for images, check for avatar
  const avatarFile = req.files?.avatar?.[0];
  const coverFile = req.files?.coverImage?.[0];
  if (!avatarFile) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatarLocalPath = avatarFile.path;
  const coverImageLocalPath = coverFile?.path;

  // upload them to cloudinary, avatar
  const avatar = await uploadOnClodinary(avatarLocalPath);
  console.log(avatar);
  const coverImage = coverImageLocalPath
    ? await uploadOnClodinary(coverImageLocalPath)
    : null;
  console.log(coverImage);
  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Avatar is required111111");
  }

  const avatarUrl = avatar.url;
  const coverImageUrl = coverImage?.url || "";
  // create user object - create entry in db
  const user = await User.create({
    fullName,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser) {
    throw new ApiError(400, "User creation failed");
  }
  // return res
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req.body-> data
  const { username, email, password } = req.body;
  // email/ username validate
  if (!email || !username) {
    throw new ApiError(400, "Email or password is required");
  }
  // find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  // access and refresh token
  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );
  // send cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true, // only modifiable by user
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };

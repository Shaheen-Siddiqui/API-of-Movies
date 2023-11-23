const { Movie } = require("../models/movies.model");
const { signupModel } = require("../models/signup.model");

async function signupHandler(signupCredentials) {
  try {
    const dbEntry = new signupModel(signupCredentials);
    return await dbEntry.save();
  } catch (error) {
    throw error;
  }
}

async function loginHandler(email, password) {
  return await signupModel.find({ email, password });
}

async function changePassword(email, currentPassword, newPassword) {
  return await signupModel.findOneAndUpdate(
    { email },
    { password: newPassword },
    { new: true }
  );
}

async function updateProfile(email, profilePictureUrl) {
  return await signupModel.findOneAndUpdate(
    { email },
    { profilePictureUrl },
    { new: true }
  );
}

async function updateContectDetails(email, updatedContect) {
  const user = await signupModel.findOne({ email });
  if (user) {
    Object.assign(user, updatedContect);
    return await user.save();
  } else throw error;
}

async function findUserByPhoneNumber(phoneNumber) {
  return await signupModel.findOne({ phoneNumber });
}

async function review_rating(movieId, userId, review, rating) {
  const user = await Movie.findOne({ _id: movieId });
  try {
    if (user) {
      user.reviews.push({ userId, review, rating });
      return await user.save();
    } else {
      throw new Error("movie not found in utils");
    }
  } catch (error) {
    throw error;
  }
}

async function getMovieReviewsWithUserDetails(movieId) {
  try {
    return await Movie.findOne({ _id: movieId });
  } catch {
    throw error;
  }
}

async function createMovie(movieData) {
  try {
    let data = new Movie(movieData);
    return await data.save();

  } catch (error) {
    throw error
  }
}

async function readMovie(obtainMovie) {
  return await Movie.findOne({ title: obtainMovie });
}

async function readAllMovies() {
  try {
    return await Movie.find({});
  } catch (error) {
    throw error;
  }
}

async function readMoviesByActor(obtainActor) {
  return await Movie.find({ actors: obtainActor });
}

async function readMoviesByDirector(obtainDirector) {
  return await Movie.find({ director: obtainDirector });
}

async function readMoviesByGenre(obtainGenre) {
  return await Movie.find({ genre: obtainGenre });
}

async function updateMovie(obtainMovieId, dataToBeUpdate) {
  return await Movie.findByIdAndUpdate(obtainMovieId, dataToBeUpdate, {
    new: true,
  });
}

async function deleteMovie(obtainMovieId) {
  return await Movie.findByIdAndDelete(obtainMovieId);
}

async function readMoviesByRating() {
  return await Movie.find({}).sort({ rating: -1 });
}

async function readMoviesByReleaseYear() {
  return await Movie.find({}).sort({ releaseYear: -1 });
}

module.exports = {
  createMovie,
  readMovie,
  readAllMovies,
  readMoviesByActor,
  readMoviesByDirector,
  readMoviesByGenre,
  updateMovie,
  deleteMovie,
  readMoviesByRating,
  readMoviesByReleaseYear,
  signupHandler,
  loginHandler,
  changePassword,
  updateProfile,
  updateContectDetails,
  findUserByPhoneNumber,
  review_rating,
  getMovieReviewsWithUserDetails,
};

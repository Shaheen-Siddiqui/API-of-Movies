const express = require("express");
const { initializeDatabase } = require("./db/db.connection");
const movieUtils = require("./helperFunctions/Utils");

const app = express();
app.use(express.json());
initializeDatabase();

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "something went wrong" });
// });

// GET request;
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});


app.get("/movies", async (req, res) => {
  try {
    const data = await movieUtils.readAllMovies();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

app.get("/movies/ratings", async (req, res) => {
  try {
    const data = await movieUtils.readMoviesByRating();
    res.json(data);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

app.get("/movies/release-years", async (req, res) => {
  try {
    const data = await movieUtils.readMoviesByReleaseYear();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

app.get("/movies/:movieId/reviews", async (req, res) => {
  const ID = req.params.movieId;

  try {
    if (ID) {
      const data = await movieUtils.getMovieReviewsWithUserDetails(ID);
      res.json(data);
    } else {
      res.status(500).json({ error: "internal server error" });
    }
  } catch {
    res.status(404).json({ error: "movie id not found" });
  }
});

app.get("/movies/:title", async (req, res) => {
  const obtainMovie = req.params.title;

  try {
    if (obtainMovie) {
      const data = await movieUtils.readMovie(obtainMovie);
      res.json({ message: "movie found", data });
    } else {
      res.send(500).json({ errro: "internal server error" });
    }
  } catch (errro) {
    res.status(400).json({ error: "movie does not found" });
  }
});

app.get("/movies/actor/:actors", async (req, res) => {
  const obtainActor = req.params.actors;

  if (obtainActor) {
    try {
      const data = await movieUtils.readMoviesByActor(obtainActor);
      res.json(data);
    } catch (errro) {
      res.status(500).json({ error: "internal server error" });
    }
  } else {
    res.status(400).json({ error: "actor params not found" });
  }
});

app.get("/movies/director/:director", async (req, res) => {
  const obtainDirector = req.params.director;

  if (obtainDirector) {
    try {
      const data = await movieUtils.readMoviesByDirector(obtainDirector);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  } else {
    res.status(400).json({ error: "director not found" });
  }
});

app.get("/movies/genre/:genre", async (req, res) => {
  const obtainGenre = req.params.genre;

  if (obtainGenre) {
    try {
      const data = await movieUtils.readMoviesByGenre(obtainGenre);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  } else {
    res.status(400).json({ error: "Genre not found!" });
  }
});

app.get("/users/phone/:phoneNumber", async (req, res) => {
  const searchNumber = req.params.phoneNumber;

  try {
    const data = await movieUtils.findUserByPhoneNumber(searchNumber);

    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch {
    res.status(500).json("Failed to fetch");
  }
});

// POST REQUESTS************************
app.post("/signup", async (req, res) => {
  const signupCredential = req.body;
  if (signupCredential) {
    try {
      const data = await movieUtils.signupHandler(signupCredential);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "renter email & username" });
    }
  } else {
    res.status(400).json({ error: "credentials not found" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const data = await movieUtils.loginHandler(email, password);
      res.json(data);
    } catch {
      res.status(500).json({ error: "internal server error" });
    }
  } else {
    res.status(400).json({ error: " email || password not found " });
  }
});

app.post("/change-password", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  try {
    const data = await movieUtils.changePassword(
      email,
      currentPassword,
      newPassword
    );
    res.json({ message: "password has bee changed ", data });
  } catch {
    res.status(401).json({ error: "invelid credentials" });
  }
});

app.post("/update-profile-picture", async (req, res) => {
  const { email, profilePictureUrl } = req.body;
  try {
    const data = await movieUtils.updateProfile(email, profilePictureUrl);
    res.json(data);
  } catch {
    res.status(401).json({ error: " invelid credentials" });
  }
});

app.post("/update-contact/:email", async (req, res) => {
  const email = req.params.email;
  const updatedContect = req.body;

  try {
    const data = await movieUtils.updateContectDetails(email, updatedContect);
    res.json(data);
  } catch {
    res.status(404).json({ error: "user not found" });
  }
});

app.post("/movies", async (req, res) => {
    const movieToAdd = req.body;
    if (movieToAdd) {
      try {
        const data = await movieUtils.createMovie(movieToAdd);
        res
          .status(201)
          .json({ message: "movie added into DB successfully", data });
      } catch (error) {
        console.error("Error adding movie to DB:", error);
        res.status(500).json({ error: "internal server error" });
      }
    } else {
      res.status(400).json({ error: "data not provided" });
    }
  });

app.post("/movies/:movieId", async (req, res) => {
  const obtainMovieId = req.params.movieId;
  const dataToBeUpdate = req.body;

  if (obtainMovieId && dataToBeUpdate) {
    try {
      const data = await movieUtils.updateMovie(obtainMovieId, dataToBeUpdate);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  } else {
    res.status(400).json({ error: "id of data not found" });
  }
});

app.post("/movies/:movieId/rating", async (req, res) => {
  const { userId, review, rating } = req.body;
  const movieId = req.params.movieId;

  try {
    const data = await movieUtils.review_rating(
      movieId,
      userId,
      review,
      rating
    );
    res.json(data);
  } catch {
    res.status(404).json({ error: "movie does not found route" });
  }
});

// DELETE REQUEST***********************************
app.delete("/movies/:movieId", async (req, res) => {
  const obtainMovieId = req.params.movieId;

  if (obtainMovieId) {
    try {
      const data = await movieUtils.deleteMovie(obtainMovieId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  } else {
    res.status(400).json({ error: "id not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

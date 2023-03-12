const express = require("express");
const app = express();

const path = require("path");

const mainRoutes = require("./routes/main");
const movieRoutes = require("./routes/movies");
const userRoutes = require("./routes/users");

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(mainRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(3000, () => {
    console.log("listening on port 3000");
});
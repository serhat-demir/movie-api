const express = require("express");
const router = express.Router();

const db = require("../data/db");
const Joi = require("joi");

router.get("/", async (req, res) => {
    try {
        const [movies,] = await db.execute("select * from movies");
        res.status(200).json({
            code: 200,
            message: "OK",
            data: movies
        });
    } catch(e) {
        res.status(500).json({
            code: 500,
            message: e.message
        });
    }
});

router.post("/", async (req, res) => {
    // validate data
    const data = req.body;
    const { error } = validateMovie(data);
    if (error) {
        return res.status(400).json({
            code: 400,
            message: error.details[0].message
        });
    }

    // add movie
    const [process,] = await db.execute("insert into movies (movie_name, movie_image, movie_url) values(?, ?, ?)", [data.movie_name, data.movie_image, data.movie_url]);
    if (process.affectedRows > 0) {
        res.status(200).json({
            code: 200,
            message: "OK"
        });
    } else {
        res.status(500).json({
            code: 500,
            message: "Something went wrong."
        });
    }
});

router.put("/:movie_id", async (req, res) => {
    // find movie
    const movie = await findMovieById(req.params.movie_id);
    if (!movie) {
        return res.status(404).json({
            code: 404,
            message: "No movie was found with this ID."
        });
    }

    // validate data
    const data = req.body;
    const { error } = validateMovie(data);
    if (error) {
        return res.status(400).json({
            code: 400,
            message: error.details[0].message
        });
    }

    // update movie
    const [process,] = await db.execute("update movies set movie_name = ?, movie_image = ?, movie_url = ? where movie_id = ?", [data.movie_name, data.movie_image, data.movie_url, req.params.movie_id]);
    if (process.affectedRows > 0) {
        res.status(200).json({
            code: 200,
            message: "OK"
        });
    } else {
        res.status(500).json({
            code: 500,
            message: "Something went wrong."
        });
    }
});

router.delete("/:movie_id", async (req, res) => {
    // find movie
    const movie = await findMovieById(req.params.movie_id);
    if (!movie) {
        return res.status(404).json({
            code: 404,
            message: "No movie was found with this ID."
        });
    }

    // delete movie
    const [process,] = await db.execute("delete from movies where movie_id = ?", [req.params.movie_id]);
    if (process.affectedRows > 0) {
        res.status(200).json({
            code: 200,
            message: "OK"
        });
    } else {
        res.status(500).json({
            code: 500,
            message: "Something went wrong."
        });
    }
});

async function findMovieById(movie_id) {
    try {
        const [movies,] = await db.execute("select * from movies where movie_id=?", [movie_id]);
        return movies[0];
    } catch(e) {
        return e.message;
    }
}

function validateMovie(movie) {
    const schema = new Joi.object({
        movie_name: Joi.string().min(3).max(100).required(),
        movie_image: Joi.string().required(),
        movie_url: Joi.string().required()
    });

    return schema.validate(movie);
}

module.exports = router;
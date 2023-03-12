const express = require("express");
const router = express.Router();

const db = require("../data/db");
const Joi = require("joi");

router.post("/", async (req, res) => {
    // validate data
    const data = req.body;
    const { error } = validateUser(data);
    if (error) {
        return res.status(404).json({
            code: 404,
            message: error.details[0].message
        });
    }

    // login
    const [rows,] = await db.execute("select * from users where user_name = ? and user_password = ?", [data.user_name, data.user_password]);
    if (rows[0]) {
        res.status(200).json({
            code: 200,
            message: "OK",
            data: rows[0]
        });
    } else {
        res.status(401).json({
            code: 401,
            message: "Username or password incorrect."
        });
    }
});

router.put("/:user_id", async (req, res) => {
    // find user
    const user = await findUserById(req.params.user_id);
    if (!user) {
        return res.status(404).json({
            code: 404,
            message: "No user was found with this ID."
        });
    }

    // validate data
    const data = req.body;
    const { error } = validateUser(data);
    if (error) {
        return res.status(400).json({
            code: 400,
            message: error.details[0].message
        });
    }

    // change password
    const [process,] = await db.execute("update users set user_password = ? where user_id = ?", [data.user_password, req.params.user_id]);
    if (process.affectedRows > 0) {
        res.status(200).json({
            code: 200,
            message: "OK",
            data: data
        });
    } else {
        res.status(500).json({
            code: 500,
            message: "Something went wrong."
        });
    }
});

async function findUserById(user_id) {
    try {
        const [users,] = await db.execute("select * from users where user_id=?", [user_id]);
        return users[0];
    } catch(e) {
        return e.message;
    }
}

function validateUser(user) {
    const schema = new Joi.object({
        user_name: Joi.string().min(3).max(50).required(),
        user_password: Joi.string().min(3).max(50).required()
    });

    return schema.validate(user);
}

module.exports = router;
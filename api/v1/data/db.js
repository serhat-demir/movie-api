const mysql = require("mysql2");
const config = require("../config");

const connection = mysql.createConnection(config.db);
connection.connect((error) => {
    if (error)
        return console.log(error);

    // console.log("connected to mysql");
});

module.exports = connection.promise();
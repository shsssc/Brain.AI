const mysql = require('mysql2');
const con = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: 'brain',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/*
con.connect(function (err) {
    if (err) throw err;
    console.log("MYSQL connection established!");
});
*/
module.exports= con;
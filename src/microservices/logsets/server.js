const express = require('express'); // minimalist web framework for Node.js
const app = express();
const sql = require('mssql/msnodesqlv8') //mssql with MS driver for SQL Server

var env = process.env.NODE_ENV || 'small';
var sqlConfig = require('../../../config')[env];

// Start server and listen on http://localhost:8081/
var server = app.listen(8082, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});

// define a simple route
app.get('/', function(req, res) {
    res.json({"message": "Logsets microservice"});
});

app.get('/logset', function (req, res) {
    console.log("Entering logsets request");
    getLogset()
        .then(r => res.json({"message": r.recordset}))
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err
            });
        });
});

const getLogset = async () => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = "SELECT A.log_guid, A.log_set_id FROM log_set_item A JOIN (select log_set_id from log_set where log_set_id = 10) B ON A.log_set_id = B.log_set_id";
    const result = await request.query(query);
    console.log(result)
    return result;
};
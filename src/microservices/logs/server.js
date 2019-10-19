const express = require('express'); // minimalist web framework for Node.js
const app = express();
const sql = require('mssql/msnodesqlv8') //mssql with MS driver for SQL Server

var env = process.env.NODE_ENV || 'small';
var sqlConfig = require('../../../config')[env];

// Start server and listen on http://localhost:8081/
var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});

// define a simple route
app.get('/', function(req, res) {
    res.json({"message": "Logs microservice"});
});

app.get('/log/:logGuid/', function (req, res) {
    console.log("Entering logs request");
    const logGuid = req.params.logGuid;
    getLog(logGuid)
        .then(r => res.json({"message": r.recordset}))
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: err
            });
        });
});

const getLog = async (logGuid) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select * from immutable_log_meta where log_guid='${logGuid}'`;
    const result = await request.query(query);
    console.log(result)
    return result;
};
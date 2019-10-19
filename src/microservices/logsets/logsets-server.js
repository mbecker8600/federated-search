const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const sql = require('mssql/msnodesqlv8') //mssql with MS driver for SQL Server

const env = process.env.NODE_ENV || 'small';
const sqlConfig = require('../../../config')[env];

const typeDefs = gql`
  type Query { 
    logset(log_set_id: Int!): Logset 
  }
  type Logset @key(fields: "log_set_id") {
    log_set_id: Int!
    name: String
    logset_items: [LogsetItem]
  }
  type LogsetItem @key(fields: "log_set_item_id") {
    log_set_item_id: Int!
    logset: Logset
    log_guid: String
  }
`;

const resolvers = {
    Query: {
        logset: (_, { log_set_id }) => getLogset(log_set_id),
    },
    Logset: {
        logset_items: log_set => getLogsetItems(log_set.log_set_id)
    },
    LogsetItem: {
        logset: (_, { log_set_id }) => getLogset(log_set_id),
    }
};

const logsetsServer = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

logsetsServer.listen({ port: 4002 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

const getLogset = async (log_set_id) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select * from log_set where log_set_id = ${log_set_id}`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset[0];
};

const getLogsetItems = async (log_set_id) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `SELECT * FROM log_set_item where log_set_id = ${log_set_id}`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset;
};
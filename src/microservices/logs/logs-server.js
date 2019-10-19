const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const sql = require('mssql/msnodesqlv8') //mssql with MS driver for SQL Server

const env = process.env.NODE_ENV || 'small';
const sqlConfig = require('../../../config')[env];

const typeDefs = gql`
  type Query { 
    log(log_guid: String!): Log 
  }
  type Log @key(fields: "log_guid") {
    log_guid: String!
    log_kind: String
    start_time: String
    log_category: String
  }
`;

const resolvers = {
    Query: {
        log: (_, { log_guid }) => getLog(log_guid)
    }
};

const logsServer = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

logsServer.listen({ port: 4001 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

const getLog = async (logGuid) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select * from immutable_log_meta where log_guid='${logGuid}'`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset[0];
};
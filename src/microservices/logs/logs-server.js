const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const sql = require('mssql/msnodesqlv8') //mssql with MS driver for SQL Server

const env = process.env.NODE_ENV || 'small';
const sqlConfig = require('../../../config')[env];

const typeDefs = gql`
  type Query { 
    log(log_guid: String!): Log 
    logs(filter: String, limit: Int): [Log]
    event(event_id: Int!): Event 
    events(filter: String, limit: Int): [Event]
  }
  type Log @key(fields: "log_guid") {
    log_guid: String!
    log_kind: String
    start_time: String
    log_category: String
    events: [Event]
  }
  type Event @key(fields: "event_id") {
    event_id: Int!
    log_guid: String
    log: Log
    event_time: String
    event_type: String
    event_severity: String
    event_comment: String
  }
`;

const resolvers = {
    Query: {
        log: (_, { log_guid }) => getLog(log_guid),
        logs: (_, { filter, limit }) => getLogs(filter, limit),
        event: (_, { event_id }) => getEvent(event_id),
        events: (_, { filter, limit }, context, info) => {
            const events = getEvents(filter, limit)
            return events
        }
    },
    Log: {
        events: log => getLogEvents(log.log_guid),
        __resolveReference(ref) {
            return getLog(ref.log_guid);
        }
    },
    Event: {
        log: (event, args, context, info) => {
            getLog(event.log_guid)
        },
        __resolveReference(ref) {
            return getEvent(ref.event_id);
        }
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

const getLogs = async (filter, limit) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select top  ${limit} * from immutable_log_meta where log_kind='${filter}'`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset;
};

const getEvent = async (eventId) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select * from event where event_id='${eventId}'`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset[0];
};

const getEvents = async (filter, limit) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select top  ${limit} * from event where event_type='${filter}'`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset;
};

const getLogEvents = async (logGuid) => {
    const pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    const request = new sql.Request(pool);
    const query = `select * from event where log_guid='${logGuid}'`;
    const result = await request.query(query);
    console.log(result)
    return result.recordset;
};
const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
    serviceList: [
        { name: "logs", url: "http://localhost:8081/graphql" },
        { name: "logsets", url: "http://localhost:8082/graphql" }
    ]
});

(async () => {
    const { schema, executor } = await gateway.load();

    const server = new ApolloServer({ schema, executor });

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
})();
require("dotenv").config();
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import client from "./client";

const PORT = process.env.PORT;

const startServer = async () => {
  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    },
  });

  await apollo.start();
  const app = express();
  app.use(logger("tiny"), graphqlUploadExpress());
  app.use("/static", express.static("uploads"));
  apollo.applyMiddleware({ app });
  app.listen({ port: PORT }, () => {
    console.log(`🚀 Server: http://localhost:${PORT}${apollo.graphqlPath}`);
  });
};
startServer();

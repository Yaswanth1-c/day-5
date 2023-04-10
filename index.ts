import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import JWT from "jsonwebtoken";
import { User } from "./models";

const JWT_SECRET = "secret";

mongoose.connect("mongodb://127.0.0.1:27017/store");
mongoose.connection
  .once("open", () => console.log("connected"))
  .on("error", (error) => {
    console.log("my error", error);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req, res }) => {
    // Get the user token from the headers
    const token = req.headers.authorization || "";

    try {
      // Verify the token
      const decoded = JWT.verify(token, JWT_SECRET) as { userId: string };

      // Find the user with the ID from the token
      const user = await User.findById(decoded.userId);

      // Add the user to the context
      return { user };
    } catch (err) {
      // Return null if there's an error or the token is invalid
      return { user: null };
    }
  },
  listen: { port: 5000 },
});

console.log(`Server running at: ${url}`);

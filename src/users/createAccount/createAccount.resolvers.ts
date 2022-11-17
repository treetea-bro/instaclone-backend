import * as bcrypt from "bcrypt";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
      { client }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });
        if (existingUser) {
          return {
            ok: false,
            error: "same username or email already exists",
          };
        }
        const uglyPassword: string = await bcrypt.hash(password, 10);
        const result = await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        if (result) {
          return {
            ok: true,
          };
        }
        return { ok: false, error: "create user failed" };
      } catch (error) {
        return error;
      }
    },
  },
};

export default resolvers;

import * as bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, username, email, password },
        { loggedInUser, client }
      ) => {
        if (password) password = await bcrypt.hash(password, 10);
        const result = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            password,
          },
        });
        if (result)
          return {
            ok: true,
          };
        return { ok: false, error: "Could not update profile." };
      }
    ),
  },
};

import { createWriteStream } from "fs";
import * as bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

export default {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        { firstName, lastName, username, email, password, bio, avatar },
        { loggedInUser, client }
      ) => {
        if (avatar) {
          const { filename, createReadStream } = await avatar;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatar = `http://localhost:4000/static/${newFilename}`;
        }

        if (password) password = await bcrypt.hash(password, 10);
        const result = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            avatar,
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

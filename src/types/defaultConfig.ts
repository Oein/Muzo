import { textToAuthKey } from "../utils/authKey";
import { Config } from "./config";
import { permission } from "./permission";

export default (): Config => {
  return {
    serverName: "My Muzo Server",
    port: 3000,
    users: [
      {
        name: "admin",
        permission: permission.Admin,
        allowedPaths: [
          {
            pathD: "/",
            permissions: [permission.Read, permission.Write],
          },
        ],
        authed: textToAuthKey("admin", global.salt),
      },
    ],
  };
};

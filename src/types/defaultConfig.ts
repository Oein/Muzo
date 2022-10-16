import { idToAuthKey } from "../utils/authKey";
import { Config } from "./config";
import { permission } from "./permission";

const defaultConfig: Config = {
  serverName: "My Muzo Server",
  port: 3000,
  users: [
    {
      name: "admin",
      permission: permission.Admin,
      allowedPaths: [
        {
          pathD: "/",
          permissions: [permission.Read, permission.Write, permission.Delete],
        },
      ],
      authed: idToAuthKey("admin", global.salt),
    },
  ],
};
export default defaultConfig;

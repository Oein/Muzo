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
    },
  ],
  salt: btoa((Math.random() * 10000000000 * new Date().getTime()).toString()),
};
export default defaultConfig;

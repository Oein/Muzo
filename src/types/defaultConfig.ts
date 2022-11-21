import { textToAuthKey } from "../utils/authKey";
import { Config } from "./config";
import { permission } from "./permission";
import nodeDiskInfo from "node-disk-info";
import { User } from "./user";

export default async (): Promise<Config> => {
  let uer: User = {
    name: "admin",
    permission: permission.Admin,
    allowedPaths: [],
    authed: textToAuthKey("admin", global.salt),
  };

  let v = await nodeDiskInfo.getDiskInfo();
  uer.allowedPaths = [];
  v.forEach((d, i) => {
    if (
      d.blocks == 0 &&
      d.used == 0 &&
      d.available == 0 &&
      d.available == 0 &&
      d.capacity == "0"
    )
      return;
    uer.allowedPaths.push({
      pathD: d.mounted,
      permissions: [permission.Write, permission.Read],
    });
  });
  return {
    serverName: "My Muzo Server",
    port: 3000,
    users: [uer],
  };
};

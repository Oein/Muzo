import { init as init_db } from "./database";

let db = init_db();

export default async function getUserByDBedUserId(dbed: string) {
  let dbed_split = dbed.split(".");
  let user_id = dbed_split[2];
  let usrs = global.config.users.filter((u) => u.authed == user_id);
  return usrs[0]!;
}

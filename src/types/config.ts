import { User } from "./user";

export interface Config {
  serverName: string;
  users: User[];
  port: number;
}

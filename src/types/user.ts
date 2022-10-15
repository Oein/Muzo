import { allowedPath } from "./allowedPath";
import { permission } from "./permission";

export interface User {
  name: string;
  allowedPaths: allowedPath[];
  permission: permission;
}

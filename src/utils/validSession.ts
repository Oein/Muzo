import { Request } from "express";
import { databasion } from "../routes/api/account/session/sessionroute";
import { init as init_db } from "./database";

let db = init_db();

export interface validSessionRET {
  valid: boolean;
  id: string;
}

export default async function validSession(
  req: Request
): Promise<validSessionRET> {
  let auth = req.headers.authorization;
  let dt = await db.get(
    `session.${databasion(
      req.headers["user-agent"] || Math.random().toString(),
      req.ip
    )}.${auth}`
  );

  if (dt == null || dt === undefined) {
    return {
      valid: false,
      id: "",
    };
  }

  return {
    valid: true,
    id: dt as string,
  };
}

export async function validSession_(
  req: Request,
  auth: string
): Promise<validSessionRET> {
  let dt = await db.get(
    `session.${databasion(
      req.headers["user-agent"] || Math.random().toString(),
      req.ip
    )}.${auth}`
  );

  if (dt == null || dt === undefined) {
    return {
      valid: false,
      id: "",
    };
  }

  return {
    valid: true,
    id: dt as string,
  };
}

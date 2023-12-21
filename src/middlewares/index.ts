import express from "express";
import { get, merge } from "lodash";
import { getUserBySessionToken } from "../modals/user";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["Session_Token"];
    if (!sessionToken) {
      return res.sendStatus(403);
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res
        .sendStatus(403)
        .send({ error: "No user found", success: false });
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res
      .sendStatus(400)
      .send({ error: "error while authenticating", success: false });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = get(req, "identity._id") as string;
    if (!userId) {
      return res.sendStatus(403);
    }
    if (userId.toString() !== id) {
      return res.sendStatus(403);
    }
    return next();
  } catch (error) {
    console.log(error);
    return res
      .sendStatus(400)
      .send({ error: "error while checking owner", success: false });
  }
};

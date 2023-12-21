import express from "express";
import { authentication, random } from "../helpers";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
} from "../modals/user";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ error: "Missing fields", success: false });
    }
    if (password.length < 6) {
      return res.status(400).send({
        error: "Password must be at least 6 characters",
        success: false,
      });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "User already exists", success: false });
    }
    const sameUsername = await getUserByUsername(username);
    if (sameUsername) {
      return res
        .status(400)
        .send({ error: "Username already exists", success: false });
    }
    const salt = random();

    const user = await createUser({
      username,
      email,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    });
    return res.status(200).send({ user }).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Missing fields", success: false });
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.status(400).send({ error: "User not found", success: false });
    }
    const excpectedHash = authentication(user.authentication.salt, password);
    if (excpectedHash !== user.authentication.password) {
      return res
        .status(403)
        .send({ error: "Incorrect password", success: false });
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("Session_Token", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    user.authentication.password = undefined;
    user.authentication.salt = undefined;
    return res.status(200).send({ user }).end();
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
};

export const logout = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.body;
    const user = await getUserById(id).select("+authentication.sessionToken");
    user.authentication.sessionToken = undefined;
    await user.save();
    res.clearCookie("Session_Token", { domain: "localhost", path: "/" });
    return res.status(200).send({ message: "Signed out successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: "Internal server error", success: false });
  }
};

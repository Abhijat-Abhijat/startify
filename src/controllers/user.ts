import express from "express";
import { deleteUserById, getAllUser, getUserById } from "../modals/user";

export const getAllusers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getAllUser();
    return res.status(200).send({ users }).end();
  } catch (error) {
    console.log(error);
    return res
      .sendStatus(400)
      .send({ error: "error while getting users", success: false });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    if (!deletedUser) {
      return res
        .sendStatus(400)
        .send({ error: "No user found", success: false });
    }
    return res.status(200).send({ deleteUser }).end();
  } catch (error) {
    console.log(error);
    return res
      .sendStatus(400)
      .send({ error: "error while deleting users", success: false });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res
        .sendStatus(400)
        .send({ error: "No username found", success: false });
    }
    const user = await getUserById(id);
    if (!user) {
      return res
        .sendStatus(400)
        .send({ error: "No user found", success: false });
    }
    user.username = username;
    await user.save();
    return res.status(200).send({ user }).end();
  } catch (error) {
    console.log(error);
    return res
      .sendStatus(400)
      .send({ error: "error while updating users", success: false });
  }
};

import express from "express";
import { isAuthenticated, isOwner } from "../middlewares";
import { deleteUser, getAllusers, updateUser } from "../controllers/user";

export default (router: express.Router) => {
  router.get("/user/all", isAuthenticated, getAllusers);
  router.delete("/user/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/user/:id", isAuthenticated, isOwner, updateUser);
};

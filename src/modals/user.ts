import mongoose from "mongoose";
import UserSchema from "../db/users";

export const UserModal = mongoose.model("User", UserSchema);

export const getAllUser = () => UserModal.find();

export const getUserByEmail = (email: string) =>
  UserModal.findOne({ email: email });

export const getUserBySessionToken = (sessionToken: string) =>
  UserModal.findOne({ "authentication.sessionToken": sessionToken });

export const getUserById = (id: string) => UserModal.findById(id);
export const getUserByUsername = (username: string) =>
  UserModal.findOne({ username: username });

export const createUser = (values: Record<string, any>) =>
  new UserModal(values)
    .save()
    .then((user: any) => {
      return user.toObject();
    })
    .catch((err: any) => {
      throw err;
    });

export const deleteUserById = (id: string) =>
  UserModal.findByIdAndDelete({ _id: id });

export const updateUser = (id: string, values: Record<string, any>) =>
  UserModal.findByIdAndUpdate({ _id: id }, values);

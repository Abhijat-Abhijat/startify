import crypto from "crypto";

const SECRET = "STARTIFY_SECRET";
export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) =>
  crypto
    .createHmac("sha512", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");

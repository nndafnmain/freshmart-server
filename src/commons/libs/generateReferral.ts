import { customAlphabet } from "nanoid";

const params = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

export const generateReferral = customAlphabet(params, 5);

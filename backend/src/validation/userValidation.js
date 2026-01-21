const zod = require("zod");
const MessageConstant = require("../constant/MessageConstant");
const email = zod
  .string(MessageConstant.EMAIL_REQUIRED)
  .trim()
  .email(MessageConstant.INVALID_EMAIL)
  .min(5, MessageConstant.EMAIL_TOO_SHORT)
  .max(255, MessageConstant.EMAIL_TOO_LONG);
const password = zod
  .string(MessageConstant.PASSWORD_REQUIRED)
  .trim()
  .min(8, MessageConstant.PASSWORD_TOO_SHORT)
  .max(64, MessageConstant.PASSWORD_TOO_LONG);
const name = zod
  .string(MessageConstant.NAME_REQUIRED)
  .trim()
  .min(2, MessageConstant.NAME_TOO_SHORT)
  .max(255, MessageConstant.NAME_TOO_LONG);
const phone = zod
  .string(MessageConstant.PHONE_NUMBER_REQUIRED)
  .trim()
  .regex(/^\d{10}$/, MessageConstant.PHONE_NUMBER_MUST_BE_10_DIGITS);

const createUser = zod.object({
  email: email,
  password: password,
  name: name,
  phone: phone,
});

const updateUser = zod.object({
  email: email.optional(),
  password: password.optional(),
  name: name.optional(),
  phone: phone.optional(),
});

module.exports = {
  createUser,
  updateUser,
};

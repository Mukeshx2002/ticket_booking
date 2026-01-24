const zod = require("zod");
const MessageConstant = require("../constant/MessageConstant");

const validation = (schema, data) => {
  try {
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return {
        success: false,
        error: error?.issues?.[0]?.message,
      };
    }
    return {
      success: false,
      errors: error.message ?? MessageConstant.INTERNAL_SERVER_ERROR,
    };
  }
};

module.exports = {
  validation,
};

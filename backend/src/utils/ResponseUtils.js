const MessageConstant = require("../constant/MessageConstant");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class ResponseUtils {
  constructor(status, code, description) {
    this.status = status;
    this.code = code;
    this.description = description;
  }

  static send(
    res,
    status,
    code,
    data = null,
    description = MessageConstant.SUCCESS_DESCRIPTION,
  ) {
    return res.status(code).json({
      data: data,
      status: new ResponseUtils(status, code, description),
    });
  }

  /*
   * SUCCESS METHODS
   */
  static getOkResponse(
    res,
    data,
    message = MessageConstant.SUCCESS_DESCRIPTION,
  ) {
    return this.send(
      res,
      MessageConstant.SUCCESS,
      StatusCodes.OK,
      data,
      message,
    );
  }

  static created(res, data, message = MessageConstant.CREATED) {
    return this.send(
      res,
      MessageConstant.SUCCESS,
      StatusCodes.CREATED,
      data,
      message,
    );
  }

  static updated(res, data, message = MessageConstant.UPDATED) {
    return this.send(
      res,
      MessageConstant.SUCCESS,
      StatusCodes.OK,
      data,
      message,
    );
  }

  static deleted(res, data, message = MessageConstant.DELETED) {
    return this.send(
      res,
      MessageConstant.SUCCESS,
      StatusCodes.OK,
      data,
      message,
    );
  }
  /*
   * ERROR METHODS
   */
  static badRequest(res, message = MessageConstant.INVALID_REQUEST) {
    return this.send(
      res,
      MessageConstant.ERROR,
      StatusCodes.BAD_REQUEST,
      null,
      message,
    );
  }

  static notFound(res, message = MessageConstant.NOT_FOUND_DESCRIPTION) {
    return this.send(
      res,
      MessageConstant.ERROR,
      StatusCodes.NOT_FOUND,
      null,
      message,
    );
  }

  static serverError(res, message = MessageConstant.SERVER_ERROR) {
    return this.send(
      res,
      MessageConstant.ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR,
      null,
      message,
    );
  }
}

module.exports = ResponseUtils;

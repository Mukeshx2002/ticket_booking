const MessageConstant = require("../constant/MessageConstant");
const UserService = require("../service/UserService");
const ResponseUtils = require("../utils/ResponseUtils");
const userService = new UserService();
class UserController {
  async addUser(req, res) {
    try {
      const response = await userService.createUser(req.body);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response.data);
      }
      return ResponseUtils.created(
        res,
        response.data,
        MessageConstant.USER_CREATED,
      );
    } catch (error) {
      console.log("Error - create user:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }
  async listUsers(req, res) {
    try {
      const response = await userService.listUsers();
      if (!response.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(
        res,
        response?.data,
        MessageConstant.OK,
      );
    } catch (error) {
      console.log("Error - list users:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async getUserById(req, res) {
    try {
      const response = await userService.getUserById(req.params.id);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(
        res,
        response?.data,
        MessageConstant.OK,
      );
    } catch (error) {
      console.log("Error - get user by id:", error);
      ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async updateUser(req, res) {
    try {
      const response = await userService.updateUser(req.params.id, req.body);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response.data);
      }
      return ResponseUtils.updated(
        res,
        response.data,
        MessageConstant.USER_UPDATED,
      );
    } catch (error) {
      console.log("Error - update user:", error);
      ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async deleteUser(req, res) {
    try {
      const response = await userService.deleteUser(req.params.id);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.deleted(
        res,
        response.data,
        MessageConstant.USER_DELETED,
      );
    } catch (error) {
      console.log("Error- delete user :", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async login(req, res) {
    try {
      const response = await userService.login(req?.body);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(
        res,
        response.data,
        MessageConstant.LOGIN_SUCCESS,
      );
    } catch (error) {
      console.log("Error - login user :", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async getFilterUser(req, res) {
    try {
      const response = await userService.getFilterUser(req.body);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response.data);
    } catch (error) {
      console.log("Error- get filter user:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }

  async getFilterUserByPage(req, res) {
    try {
      const response = await userService.getFilterUserByPage(req.body);
      if (!response.success) {
        return ResponseUtils.badRequest(res, response?.data);
      }
      return ResponseUtils.getOkResponse(res, response?.data);
    } catch (error) {
      console.log("Error- get filter user by page:", error);
      return ResponseUtils.serverError(res, error?.message || error);
    }
  }
}

module.exports = UserController;

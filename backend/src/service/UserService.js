const MessageConstant = require("../constant/MessageConstant");
const bcrypt = require("bcrypt");
const UserRepository = require("../repository/UserRepository");
const { validation } = require("../validation");
const { createUser, updateUser } = require("../validation/userValidation");
const userRepository = new UserRepository();
class UserService {
  async createUser(data) {
    try {
      // first validate data
      const validateData = validation(createUser, data);
      if (!validateData.success) {
        return { success: false, data: validateData?.error };
      }
      const { name, email, password, phone } = validateData?.data || {};

      //check if email already exists
      const existingUser = await userRepository.getUserByEmail(email);
      if (existingUser) {
        return {
          success: false,
          data: MessageConstant.EMAIL_ALREADY_EXISTS,
        };
      }

      // convert password string into hash string
      const hashedPassword = await bcrypt.hash(password, 10);

      // stored in database
      const user = await userRepository.create({
        ...data,
        role: "USER", //default user role
        password: hashedPassword,
      });

      // return object
      return { success: true, data: user };
    } catch (error) {
      console.log("Error- create user:", error);
      return { success: false, data: error?.message || error };
    }
  }

  async listUsers() {
    try {
      const users = await userRepository.getAll();
      return { success: true, data: users };
    } catch (error) {
      console.log("Error- list users:", error);
      return { success: false, data: error?.message || error };
    }
  }

  async getUserById(id) {
    try {
      const user = await userRepository.getById(id);
      return { success: true, data: user };
    } catch (error) {
      console.log("Error- get user by id:", error);
      return { success: false, data: error?.message || error };
    }
  }

  async updateUser(id, data) {
    try {
      // validate data
      const validateData = validation(updateUser, data);
      if (!validateData?.success) {
        return { success: false, data: validateData?.error };
      }
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      const [row, user] = await userRepository.update(id, data);
      return { success: true, data: user };
    } catch (error) {
      console.log("Error- update user:", error);
      return { success: false, data: error?.message || error };
    }
  }

  async deleteUser(id) {
    try {
      const [row, user] = await userRepository.delete(id);
      return { success: true, data: user };
    } catch (error) {
      console.log("Error- delete user:", error);
      return { success: false, data: error?.message || error };
    }
  }

  async login(data) {
    try {
      const { email, password } = data || {};
      //validate user exists or no
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return { success: false, data: MessageConstant.USER_NOT_FOUND };
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          data: MessageConstant.PASSWORD_DOES_NOT_MATCH,
        };
      }
      return { success: true, data: user };
    } catch (error) {
      console.log("Error- login user:", error);
      return { success: false, data: error?.message || error };
    }
  }

  async getFilterUser(data) {
    try {
      const { filter, sort } = data || {};
      const response = await userRepository.filter(filter, sort);
      return { success: true, data: response };
    } catch (error) {
      console.log("Error: get filter user:", error);
      return { success: false, data: error?.message || error };
    }
  }
  async getFilterUserByPage(data) {
    try {
      const { filter, sort, page } = data || {};
      const response = await userRepository.filterByPagination(
        filter,
        sort,
        page,
      );
      return { success: true, data: response };
    } catch (error) {
      console.log("Error- get filter user by page:", error);
      return { success: false, data: error?.message || error };
    }
  }
}
module.exports = UserService;

const { Op } = require("sequelize");
const CommonRepository = require(".");
const User = require("../model/User");

const whereClause = (data) => {
  const { email, id, role, isActive, softDelete = false, search } = data || {};
  const where = {};
  if (email) where.email = data.email;
  if (id) where.id = data.id;
  if (role) where.role = data.role;
  if (isActive != undefined || isActive != null) where.isActive = data.isActive;

  where.softDelete =
    softDelete === undefined || softDelete === null ? false : softDelete;

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  return where;
};

const association = {};
const attributes = [
  "id",
  "email",
  "name",
  "phone",
  "role",
  "isActive",
  "softDelete",
  "createdAt",
  "updatedAt",
];
class UserRepository extends CommonRepository {
  constructor() {
    super(User, whereClause, association, attributes);
  }
  async getUserByEmail(email) {
    return await User.findOne({ where: { email, softDelete: false } });
  }
}
module.exports = UserRepository;

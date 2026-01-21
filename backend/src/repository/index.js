class CommonRepository {
  constructor(model, whereOptions, association, attributes) {
    this.model = model;
    this.whereClause = whereOptions;
    this.association = association;
    this.attributes = attributes;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    return await this.model.update(data, { where: { id }, returning: true });
  }

  async getById(id) {
    return await this.model.findOne({
      attributes: this.attributes,
      ...this.association,
      where: { id, softDelete: false },
    });
  }
  async getAll() {
    return await this.model.findAll({
      attributes: this.attributes,
      ...this.association,
      where: { softDelete: false },
    });
  }

  async delete(id) {
    return await this.model.update(
      { softDelete: true },
      { where: { id }, returning: true },
    );
  }

  async filter(filter, sort) {
    const { sortBy = "createdAt", sortOrder = "DESC" } = sort || {};
    return await this.model.findAll({
      attributes: this.attributes,
      ...this.association,
      where: this.whereClause(filter),
      order: [[sortBy, sortOrder]],
    });
  }

  async filterByPagination(filter, sort, page) {
    const { sortBy = "createdAt", sortOrder = "DESC" } = sort || {};
    const { pageNumber = 0, pageLimit = 10 } = page || {};
    return await this.model.findAndCountAll({
      attributes: this.attributes,
      ...this.association,
      where: this.whereClause(filter),
      order: [[sortBy, sortOrder]],
      offset: pageNumber * pageLimit,
      limit: pageLimit,
    });
  }
}

module.exports = CommonRepository;

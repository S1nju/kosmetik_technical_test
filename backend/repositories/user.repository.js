const User = require('../models/User');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(data) {
    return await User.create(data);
  }
}

module.exports = UserRepository;

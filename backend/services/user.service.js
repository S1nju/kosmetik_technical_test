const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || 'supersecretkey123';
  }

  async register(data) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      const error = new Error('Email is already commonly used');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      email: data.email,
      password: hashedPassword
    });

    return { id: user.id, email: user.email };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, this.jwtSecret, {
      expiresIn: '1d'
    });

    return { token, user: { id: user.id, email: user.email } };
  }
}

module.exports = UserService;

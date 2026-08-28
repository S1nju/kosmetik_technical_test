const UserService = require('../../services/user.service');
const bcrypt = require('bcryptjs');

describe('UserService Unit Tests', () => {
  let userService;
  let mockUserRepo;

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      create: jest.fn()
    };
    userService = new UserService(mockUserRepo);
  });

  describe('register', () => {
    it('should throw a 409 error if email is already in use', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'test@kosmetikon.com' });
      
      await expect(
        userService.register({ email: 'test@kosmetikon.com', password: 'password123' })
      ).rejects.toThrow('Email is already commonly used');
    });

    it('should securely hash password and create a new user', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue({ id: 2, email: 'new@kosmetikon.com' });
      
      const result = await userService.register({ email: 'new@kosmetikon.com', password: 'password123' });
      
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(mockUserRepo.create.mock.calls[0][0].password).not.toBe('password123'); // Password must be hashed
      expect(result).toEqual({ id: 2, email: 'new@kosmetikon.com' });
    });
  });

  describe('login', () => {
    it('should throw 401 error if user email does not exist', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      await expect(
        userService.login('wrong@kosmetikon.com', 'password')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw 401 error if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'user@kosmetikon.com', password: hashedPassword });
      
      await expect(
        userService.login('user@kosmetikon.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should return a valid JWT token on successful login', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'user@kosmetikon.com', password: hashedPassword });
      
      const result = await userService.login('user@kosmetikon.com', 'correctpassword');
      expect(result).toHaveProperty('token');
      expect(result.user).toEqual({ id: 1, email: 'user@kosmetikon.com' });
    });
  });
});

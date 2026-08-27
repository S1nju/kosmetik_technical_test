class AuthController {
  constructor(userService) {
    this.userService = userService;
  }

  register = async (req, res, next) => {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

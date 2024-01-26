const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
  it("should populate req.user with decoded payload", () => {
    const token = new User().generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};

    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});

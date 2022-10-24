const jsonwebtoken = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jsonwebtoken.verify(token, "4wheelsmovethebody2wheelsmovethesoul");
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication Failed!",
    });
  }
};

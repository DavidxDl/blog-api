var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "Habibi", greet: "Sup Man!" });
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const user = {
      username: req.body.username,
      password: req.body.password,
    };

    if (
      process.env.ADMIN_USERNAME === user.username &&
      process.env.ADMIN_PASSWORD === user.password
    ) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.statusCode = 200;
      res.json({ acessToken: accessToken });
    }
    res.statusCode = 400;
    res.json({ error: "wrong creadentials" });
  }),
);

module.exports = router;

// init code
const router = require("express").Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("./../models/user");

// middlewere setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// router goes here
// default route
router.all("/", (req, res) => {
  return res.json({
    status: true,
    message: "User controller working",
  });
});

// get method code
router.get("/find", function (req, res) {
  User.findOne(
    { email : req.query.email },
    { password: false },
    function (error, result) {
      if (error) throw error;
      return res.json({
        status: true,
        message: "sucess",
        result: result,
      });
    }
  );
});

// crate new user using post method.
router.post(
  "/createUser",
  [
    check("username").not().isEmpty().trim().escape(),
    check("password").not().isEmpty().trim().escape(),
    check("email").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    // check validation code
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: "Form validation error",
        errors: errors.array(),
      });
    }

    // hash password code.
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // output data code
    const temp = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    temp.save(function (error, result) {
      if (error) {
        return res.json({
          status: false,
          message: "Fail",
          error: error,
        });
      } else {
        return res.sendStatus(200).json({
          status: true,
          message: "sucsess",
          result: result,
        });
      }
    });

    // return res.sendStatus(200);
  }
);

// put method code
router.put("/put/:email", (req, res) => {
  if (req.params.email) {
    User.findOneAndUpdate(
      { email: req.params.email },
      { username: "akash" },
      (error, result) => {
        if (error) return res.send(error);
        else return res.send(result);
      }
    );
  }
});

// delete method code
router.delete("/delete/:id", (req, res) => {
  if (req.params.id) {
    User.remove({ _id: req.params.id }, (error, result) => {
      if (error) return res.sendStatus(500);
      else return res.send(result);
    });
  }
});

router.post(
  "/login",
  [
    check("password").not().isEmpty().trim().escape(),
    check("email").isEmail().normalizeEmail(),
  ],
  (req, res) => {
    // check validation error
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: "Form validation error",
        error: error.array(),
      });
    }

    User.findOne({ email: req.body.email }, function (error, result) {
      if (error) {
        return res.json({
          status: false,
          message: "Fail",
          error: error,
        });
      }
      if (result) {
        const isMatch = bcrypt.compareSync(req.body.password, result.password);

        if (isMatch) {
          return res.json({
            status: true,
            message: "Login Sucess..",
            result: result,
          });
        } else {
          return res.json({
            status: false,
            message: "Login Fail...",
          });
        }
      } else {
        return res.json({
          status: false,
          message: "User not Exist..",
        });
      }
    });
  }
);
// module exports
module.exports = router;

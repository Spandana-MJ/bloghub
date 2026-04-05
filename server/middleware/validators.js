
const { body, validationResult } = require("express-validator");

// Reusable function to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg // return first error
    });
  }
  next();
};

// Blog validation rules
const blogValidation = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 100 }).withMessage("Title max 100 characters"),

  body("subtitle")
    .trim()
    .notEmpty().withMessage("Subtitle is required")
    .isLength({ max: 150 }).withMessage("Subtitle max 150 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("Description is required"),

  body("category")
    .optional()
    .isIn([
      "Technology", "Lifestyle", "Travel",
      "Food", "Health", "Business", "Other"
    ])
    .withMessage("Invalid category"),
];

// Comment validation rules
const commentValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 50 }).withMessage("Name max 50 characters"),

  body("text")
    .trim()
    .notEmpty().withMessage("Comment text is required")
    .isLength({ max: 500 }).withMessage("Comment max 500 characters"),
];

// Login validation rules
const loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password min 6 characters"),
];

module.exports = {
  validate,
  blogValidation,
  commentValidation,
  loginValidation,
};
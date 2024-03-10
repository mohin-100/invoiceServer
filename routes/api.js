var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/motivation", (req, res) => {
  const motivationalQuotes = [
    {
      quote:
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      author: "Winston Churchill",
    },
    {
      quote: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt",
    },
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      quote: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson",
    },
    {
      quote:
        "Success usually comes to those who are too busy to be looking for it.",
      author: "Henry David Thoreau",
    },
    {
      quote:
        "The only limit to our realization of tomorrow will be our doubts of today.",
      author: "Franklin D. Roosevelt",
    },
    {
      quote: "It always seems impossible until it's done.",
      author: "Nelson Mandela",
    },
  ];

  try {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const randomQuote = motivationalQuotes[randomIndex];
    res
      .status(200)
      .json({ status: 200, message: "Success", data: randomQuote });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

module.exports = router;

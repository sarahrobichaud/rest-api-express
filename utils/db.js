const mongoose = require("mongoose");

const connectToDB = string => {
  mongoose.set("useUnifiedTopology", true);
  const options = { useNewUrlParser: true };
  const db = mongoose.connect(string, options);
};

module.exports = connectToDB;

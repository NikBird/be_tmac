const mongoose = require("mongoose");
const { UserModel } = require("./user");
const { ModsModel } = require("./mods");
require('dotenv').config()

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("Couldn't connect to MongoDB instance!", err);
    process.exit(1);
  }
}

const fetchUser = async (username) => {
  try {
    const user = await UserModel.findOne({ username });
    return user;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const fetchMod = async (username, password) => {
  try {
    const modsMan = await ModsModel.findOne({ username, password });
    return modsMan;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = {
  connectDatabase,
  fetchUser,
  fetchMod
};

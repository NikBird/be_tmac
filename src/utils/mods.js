const { Schema, model } = require("mongoose");

const ModsSchema = new Schema({
  username: { type: String },
  password: { type: String },

});

const ModsModel = model("ModsModel", ModsSchema);

module.exports = {
    ModsModel,
};

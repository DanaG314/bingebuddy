const mongoose = require("mongoose");
// Shortcut variable
const Schema = mongoose.Schema;

const recommendationSchema = new Schema ({
  owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  },
  media: {
      type: Schema.Types.ObjectId,
      ref: 'Media'
  },
  note: {
    type: String
  },
}, {
  timestamps: true,
}
);


const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  recommendations: [recommendationSchema],
});

module.exports = mongoose.model("User", userSchema);

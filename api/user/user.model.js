const mongoose = require('mongoose');
require('dotenv').config();

const { SALT_ROUNDS } = process.env;

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    /* posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ], */
  },
  {
    timestamps: true,
  }
);

// methods

UserSchema.pre('save', async function save(next) {
  const user = this;

  try {
    if (!user.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  } catch (e) {
    next(e);
  }
});

UserSchema.virtual('profile').get(function profile() {
  const { userName, name, lastName, email, avatar } = this;

  return {
    userName,
    name,
    lastName,
    email,
    avatar,
  };
});

UserSchema.methods.comparePassword = async function comparepassword(
  enteredPassword,
  next
) {
  const user = this;

  try {
    const isMatch = await bcrypt.compare(enteredPassword, user.password);
    return isMatch;
  } catch (e) {
    next(e);
    return false;
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;


// const crypto = require('crypto');
// const mongoose = require('mongoose');
// const validator = require('validator');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please tell us your name!']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide your email'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please provide a valid email']
//   },
//   photo: String,
//   role: {
//     type: String,
//     enum: ['user', 'guide', 'lead-guide', 'admin'],
//     default: 'user'
//   },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: 8,
//     select: false
//   },
//   passwordConfirm: {
//     type: String,
//     required: [true, 'Please confirm your password'],
//     validate: {
//       // This only works on CREATE and SAVE!!!
//       validator: function(el) {
//         return el === this.password;
//       },
//       message: 'Passwords are not the same!'
//     }
//   },
// googleId: String,

//   active: {
//     type: Boolean,
//     default: true,
//     select: false
//   }
// });





// userSchema.pre('save', async function(next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });




// userSchema.methods.correctPassword = async function(
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };







// const User = mongoose.model('User', userSchema);

// module.exports = User;
// // facebookId: String


// const Role = require('./rolesModel');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please tell us your name!']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide your email'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please provide a valid email']
//   },
//   photo: String,
//   role: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Role'
//   },

//   password: {
//     type: String,
//     minlength: 8,
//     select: false
//   },
//   passwordConfirm: {
//     type: String,
//     validate: {
//       validator: function(el) {
//         return el === this.password;
//       },
//       message: 'Passwords are not the same!'
//     }
//   },
//   googleId: String,
//   active: {
//     type: Boolean,
//     default: true,
//     select: false
//   }
// });



// userSchema.pre(/^find/, function(next) {
//   this.populate('role');
//   next();
// });
// // Conditional validation for password and passwordConfirm
// userSchema.path('password').validate(function(value) {
//   // If googleId is present, password is not required
//   return !this.googleId || value.length >= 8;
// }, 'Please provide a password with at least 8 characters');

// userSchema.path('passwordConfirm').validate(function(value) {
//   // If googleId is present, passwordConfirm is not required
//   return !this.googleId || this.password === value;
// }, 'Passwords are not the same!');









// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();

//   // Hash the password with cost of 12 if googleId is not present
//   if (!this.googleId) {
//     this.password = await bcrypt.hash(this.password, 12);
//     this.passwordConfirm = undefined;

//   }

//   // Delete passwordConfirm field if googleId is present
//   if (this.googleId) {
//     this.passwordConfirm = undefined;
//     this.password = undefined;

//   }

//   next();
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
// facebookId: String




















const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const Role = require('./rolesModel');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
    googleId: String,

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});


userSchema.pre(/^find/, function(next) {
  this.populate('role');
  next();
});



userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12 if googleId is not present
  if (!this.googleId) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

  }

  // Delete passwordConfirm field if googleId is present
  if (this.googleId) {
    this.passwordConfirm = undefined;
    this.password = undefined;

  }

  next();
});


userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../../../models/user";

const _throw = (message, errorCallback) => {
  console.log(message);
  errorCallback({ message });
};

const startAuthenticatedSession = (req, user, cb) => {
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user;
    } else {
      _throw(err, () => {});
    }
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  req.session.destroy((err) => {
    cb(err);
  });
};

const register = async (username, password, errorCallback, successCallback) => {
  await User.findOne({ username }).then((data) => {
    if (data) {
      _throw("USERNAME ALREADY EXISTS", errorCallback);
    } else {
      bcrypt.hash(password, 10, async (err, hash) => {
        const user = new User({ username, password: hash });
        await user
          .save()
          .then((data) => successCallback(data))
          .catch(() => _throw("DOCUMENT SAVE ERROR", errorCallback));
      });
    }
  });
};

const login = (username, password, errorCallback, successCallback) => {
  User.findOne({ username }, (err, user) => {
    if (!err && user) {
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if (passwordMatch) {
          successCallback(user);
        } else {
          _throw("PASSWORDS DO NOT MATCH", errorCallback);
        }
      });
    } else {
      _throw("USER NOT FOUND", errorCallback);
    }
  });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = (authRequiredPaths) => {
  return (req, res, next) => {
    if (authRequiredPaths.includes(req.path)) {
      if (!req.session.user) {
        res.redirect("/login");
      } else {
        next();
      }
    } else {
      next();
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired,
};

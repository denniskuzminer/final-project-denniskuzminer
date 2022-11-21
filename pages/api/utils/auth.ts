import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../../../models/user";
// let bcrypt = { compare: (...args: any) => {}, hash: (...args: any) => {} };

const _throw = (
  message: string,
  errorCallback: { (): void; (arg0: { message: any }): void }
) => {
  console.log(message);
  errorCallback({ message });
};

const startAuthenticatedSession = (
  req: {
    session: { regenerate: (arg0: (err: any) => void) => void; user: any };
  },
  user: any,
  cb: (arg0: any) => void
) => {
  req.session.regenerate((err: any) => {
    if (!err) {
      req.session.user = user;
    } else {
      _throw(err, () => {});
    }
    cb(err);
  });
};

const endAuthenticatedSession = (
  req: { session: { destroy: (arg0: (err: any) => void) => void } },
  cb: (arg0: any) => void
) => {
  req.session.destroy((err: any) => {
    cb(err);
  });
};

const register = async (
  username: any,
  password: string,
  errorCallback: any,
  successCallback: (arg0: any) => any
) => {
  await User.findOne({ username }).then((data) => {
    if (data) {
      _throw("USERNAME ALREADY EXISTS", errorCallback);
    } else {
      bcrypt.hash(password, 10, async (err: any, hash: any) => {
        const user = new User({ username, password: hash });
        await user
          .save()
          .then((data: any) => successCallback(data))
          .catch(() => _throw("DOCUMENT SAVE ERROR", errorCallback));
      });
    }
  });
};

const login = (
  username: any,
  password: string,
  errorCallback: any,
  successCallback: (arg0: any) => void
) => {
  User.findOne({ username }, (err: any, user: { password: string }) => {
    if (!err && user) {
      bcrypt.compare(
        password,
        user.password,
        (err: any, passwordMatch: any) => {
          if (passwordMatch) {
            successCallback(user);
          } else {
            _throw("PASSWORDS DO NOT MATCH", errorCallback);
          }
        }
      );
    } else {
      _throw("USER NOT FOUND", errorCallback);
    }
  });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = (authRequiredPaths: string | any[]) => {
  return (
    req: { path: any; session: { user: any } },
    res: { redirect: (arg0: string) => void },
    next: () => void
  ) => {
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

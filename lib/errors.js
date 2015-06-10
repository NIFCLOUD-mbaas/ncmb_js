"use strict";

var createError = require("create-error");

module.exports = {
  UnmodifiableVariableError: createError("UnmodifiableVariableError"),
  InvalidWhereError:         createError("InvalidWhereError"),
  InvalidOffsetError:        createError("InvalidOffsetError"),
  EmptyArrayError:           createError("EmptyArrayError"),
  InvalidLimitError:         createError("InvalidLimitError"),
  NoObjectIdError:           createError("NoObjectIdError"),
  NoAuthInfoError:           createError("NoAuthInfoError"),
  NoFileNameError:           createError("NoFileNameError"),
  NoUserNameError:          createError("NoUserNameError"),
  NoPasswordError:           createError("NoPasswordError")
};

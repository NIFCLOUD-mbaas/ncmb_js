"use strict";

var createError = require("create-error");

module.exports = {
  UnmodifiableVariableError: createError("UnmodifiableVariableError"),
  InvalidWhereError:         createError("InvalidWhereError"),
  InvalidOffsetError:        createError("InvalidOffsetError"),
  InvalidLimitError:         createError("InvalidLimitError"),
  NoObjectIdError:           createError("NoObjectIdError"),
  NoFileNameError:           createError("NoFileNameError"),
  NoKeyError:                createError("NoKeyError"),
  NoValueError:              createError("NoValueError")
};

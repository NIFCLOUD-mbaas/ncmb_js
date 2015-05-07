"use strict";

var createError = require("create-error");

module.exports = {
  UnmodifiableVariableError: createError("UnmodifiableVariableError"),
  InvalidWhereError:         createError("InvalidWhereError"),
  InvalidOffsetError:        createError("InvalidOffsetError"),
  InvalidObjectsArrayError:  createError("InvalidObjectsArrayError"),
  InvalidLimitError:         createError("InvalidLimitError")
};

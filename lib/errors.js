"use strict";

var createError = require("create-error");

module.exports = {
  UnmodifiableVariableError: createError("UnmodifiableVariableError"),
  InvalidWhereError:         createError("InvalidWhereError"),
  InvalidOffsetError:        createError("InvalidOffsetError"),
  EmptyArrayError:           createError("EmptyArrayError"),
  InvalidLimitError:         createError("InvalidLimitError"),
  NoObjectIdError:           createError("NoObjectIdError"),
  NoKeyError:                createError("NoKeyError"),
  NoValueError:              createError("NoValueError"),
  NoMailAddressError:        createError("NoMailAddressError"),
  NoFileNameError:           createError("NoFileNameError"),
  NoACLError:                createError("NoACLError")
};

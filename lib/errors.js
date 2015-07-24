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
  InvalidFormatError:        createError("InvalidFormatError"),
  NoMailAddressError:        createError("NoMailAddressError"),
  NoACLError:                createError("NoACLError"),
  InvalidArgumentError:      createError("InvalidArgumentError"),
  NoSessionTokenError:       createError("NoSessionTokenError"),
  InvalidAuthInfoError:      createError("InvalidAuthInfoError"),
  ContentsConflictError:     createError("ContentsConflictError")
};

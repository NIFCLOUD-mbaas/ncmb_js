"use strict";

var createError = require("create-error");

module.exports = {
  UnmodifiableVariableError: createError("UnmodifiableVariableError"),
  InvalidWhereError:         createError("InvalidWhereError"),
  InvalidOffsetError:        createError("InvalidOffsetError"),
  EmptyArrayError:           createError("EmptyArrayError"),
  InvalidLimitError:         createError("InvalidLimitError"),
  NoObjectIdError:           createError("NoObjectIdError"),
  NoRoleNameError:           createError("NoRoleNameError"),
  NoAuthInfoError:           createError("NoAuthInfoError"),
  NoUserNameError:           createError("NoUserNameError"),
  NoPasswordError:           createError("NoPasswordError"),
  NoMailAddressError:        createError("NoMailAddressError"),
  NoFileNameError:           createError("NoFileNameError"),
  NoACLError:                createError("NoACLError"),
  NoProviderInfoError:       createError("NoProviderError"),
  NoOAuthDataError:          createError("NoOAuthDataError"),
  InvalidProviderError:      createError("InvalidProviderError"),
  InvalidOAuthDataError:     createError("InvalidOAuthDataError"),
  InvalidAuthDataError:      createError("InvalidAuthDataError"),
  InvalidArgumentError:      createError("InvalidArgumentError"),
  NoSessionTokenError:       createError("NoSessionTokenError"),
  InvalidFormatError:        createError("InvalidFormatError"),
  InvalidAuthInfoError:      createError("InvalidAuthInfoError"),
  ContentsConflictError:     createError("ContentsConflictError"),
  UnReplaceableKeyError:     createError("UnReplaceableKeyError"),
  UnknownAuthProviderError:  createError("UnknownAuthProviderError"),
  OutOfRangeInputError:      createError("OutOfRangeInputError"),
  DuplicatedInputError:      createError("DuplicatedInputError"),
  NotImplementedProviderValidationError: createError("NotImplementedProviderValidationError")
};

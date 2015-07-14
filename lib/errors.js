"use strict";

var createError = require("create-error");

module.exports = {
  UnmodifiableVariableError: createError("UnmodifiableVariableError"),
  InvalidWhereError:         createError("InvalidWhereError"),
  InvalidOffsetError:        createError("InvalidOffsetError"),
  EmptyArrayError:           createError("EmptyArrayError"),
  InvalidLimitError:         createError("InvalidLimitError"),
  NoObjectIdError:           createError("NoObjectIdError"),
  NoMailAddressError:        createError("NoMailAddressError"),
  NoFileNameError:           createError("NoFileNameError"),
  NoACLError:                createError("NoACLError"),
  NoProviderInfoError:       createError("NoProviderError"),
  NoOAuthDataError:          createError("NoOAuthDataError"),
  InvalidProviderError:      createError("InvalidProviderError"),
  InvalidOAuthDataError:     createError("InvalidOAuthDataError")
  
};
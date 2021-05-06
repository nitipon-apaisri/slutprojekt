class BaseError extends Error {
  constructor(message, errorCode) {
    super(message);
    this._errorCode = errorCode;
  }

  get errorCode() {
    return this._errorCode;
  }
}

module.exports = BaseError;

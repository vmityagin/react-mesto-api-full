const ERROR_CODE = 400;
const ERROR_VALID = 401;
const ERROR_USER = 404;
const ERROR_SERVER = 500;
const regularLinkRegExp = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/;

module.exports = {
  ERROR_CODE,
  ERROR_USER,
  ERROR_SERVER,
  ERROR_VALID,
  regularLinkRegExp,
};

// check-type.js

function typeOf(arg) {
  if (arg && arg.constructor && arg.constructor.name === "Array") {
    return "array";
  } else if (arg && arg.constructor && arg.constructor.name === "Boolean") {
    return "boolean";
  } else if (arg && arg.constructor && arg.constructor.name === "Date") {
    return "date";
  } else if (arg && arg.constructor && arg.constructor.name === "Function") {
    return "function";
  } else if (
    arg &&
    arg.constructor &&
    arg.constructor.name === "String" &&
    arg.length === 1
  ) {
    return "character";
  } else if (arg && arg.constructor && arg.constructor.name === "Number") {
    return "number";
  } else if (arg && arg.constructor && arg.constructor.name === "String") {
    return "string";
  } else if (arg === NaN) {
    return "NaN";
  } else if (arg === null) {
    return "null";
  } else if (arg === undefined) {
    return "undefined";
  } else {
    return "unknown";
  }
}
function isArray(arg) {
  return arg && arg.constructor && arg.constructor.name === "Array";
}
function isBoolean(arg) {
  return arg && arg.constructor && arg.constructor.name === "Boolean";
}
function isDate(arg) {
  return arg && arg.constructor && arg.constructor.name === "Date";
}
function isFunction(arg) {
  return arg && arg.constructor && arg.constructor.name === "Function";
}
function isCharacter(arg) {
  return (
    arg &&
    arg.constructor &&
    arg.constructor.name === "String" &&
    arg.length === 1
  );
}
function isNumber(arg) {
  return arg && arg.constructor && arg.constructor.name === "Number";
}
function isString(arg) {
  return arg && arg.constructor && arg.constructor.name === "String";
}
function isObject(arg) {
  return arg && arg.constructor && arg.constructor.name === "Object";
}

function isNull(arg) {
  return arg === null;
}
function isUndefined(arg) {
  return arg === undefined;
}

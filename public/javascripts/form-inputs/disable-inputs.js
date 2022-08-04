// disable-inputs.js

function disableInput(arr) {
  for (let i = 0; i < arr.length; i++) {
    const elements = document.querySelectorAll(arr[i]);

    elements.forEach((element, index) => {
      element.setAttribute("disabled", "");
    });
  }
}

// Disable input by query selector
function disableInputByQuerySelector(object) {
  try {
    if (!checkObjectForTargetProperty(object))
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          "Invalid argument!"
        )
      );

    if (object && object.target) {
      const target = object.target;
      const element = document.querySelector(target);
      element.setAttribute("disabled", "");
    }

    if (object && object.targets) {
      object.targets.forEach((target, targetIndex) => {
        const element = document.querySelector(target);
        element.setAttribute("disabled", "");
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// Enable input by query selector
function enableInputByQuerySelector(...args) {
  try {
    if (!checkObjectForTargetProperty(object))
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          "Invalid argument!"
        )
      );

    if (object && object.target) {
      const target = object.target;
      const element = document.querySelector(target);
      element.removeAttribute("disabled");
    }

    if (object && object.targets) {
      object.targets.forEach((target, targetIndex) => {
        const element = document.querySelector(target);
        element.removeAttribute("disabled");
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// Switch destination input according to source input
function switchInputsById(...args) {
  try {
    args.forEach((arg, index) => {
      const srcElement = document.getElementById(arg.src);
      const destElement = document.getElementById(arg.dest);

      if (srcElement && destElement) {
        // console.log(srcElement.value, "->", destElement.value);

        if (srcElement.value === "") {
          destElement.setAttribute("disabled", "");
        }

        srcElement.addEventListener("change", (e) => {
          if (srcElement.value === "") {
            destElement.setAttribute("disabled", "");
          } else {
            destElement.removeAttribute("disabled");
          }

          checkDependentInputs(...args);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// Check dependent inputs
function checkDependentInputs(...args) {
  try {
    args.forEach((arg, index) => {
      const srcElement = document.getElementById(arg.src);
      const destElement = document.getElementById(arg.dest);

      if (srcElement && destElement) {
        if (srcElement.value === "") {
          destElement.children[0].setAttribute("selected", "");
          destElement.setAttribute("disabled", "");
        }

        srcElement.addEventListener("change", (e) => {
          if (srcElement.value === "") {
            destElement.children[0].setAttribute("selected", "");
            destElement.setAttribute("disabled", "");
          } else {
            destElement.children[0].removeAttribute("selected");
            destElement.removeAttribute("selected");
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

function getClasses(...args) {
  try {
    // const srcElement = args[0];
    // const destElement = args[1];
    const srcElement = document.getElementById(args[0]);
    const destElement = document.getElementById(args[1]);
    const text = args[2] || "";

    let total_class = 0;

    if (srcElement.value === "BE") {
      total_class = 4;
    }
    if (srcElement.value === "ME") {
      total_class = 2;
    }

    destElement.innerHTML = "";

    const option = document.createElement("option");
    option.innerText = "Class";
    option.setAttribute("selected", "");
    destElement.appendChild(option);

    for (let i = 1; i <= total_class; i++) {
      const option = document.createElement("option");

      option.innerText = `${convertIntoOrdinalNumber(i)} ${text}`;

      option.setAttribute("value", i);
      destElement.appendChild(option);
    }
  } catch (err) {
    console.log(err);
  }
}

function convertIntoOrdinalNumber(n) {
  try {
    var result = `${n}th`;

    if (isNaN(n))
      throw new Error(
        createLogMessageForFunction(
          arguments.callee.name,
          "arguments[0]",
          `'${arguments[0]}' must be a number.`
        )
      );

    n = parseInt(n);

    const st = [1, 11, 21, 31, 41, 51, 61, 71, 81, 91];
    const nd = [2, 12, 22, 32, 42, 52, 62, 72, 82, 92];
    const rd = [3, 13, 23, 33, 43, 53, 63, 73, 83, 93];

    st.filter((i) => {
      if (n === i) {
        result = `${n}st`;
      }
    });
    nd.filter((i) => {
      if (n === i) {
        result = `${n}nd`;
      }
    });
    rd.filter((i) => {
      if (n === i) {
        result = `${n}rd`;
      }
    });
    return result;
  } catch (err) {
    console.log(err);
    return n;
  }

  function createLogMessageForFunction(...argument) {
    switch (argument.length) {
      case 1:
        return `${argument[0]}`;
        break;
      case 2:
        return `${argument[0]}: ${argument[1]}`;
        break;
      case 3:
        return `${argument[0]}: ${argument[1]}: ${argument[2]}`;
        break;
      case 4:
        return `${argument[0]}: ${argument[1]}: ${argument[2]}: ${argument[3]}`;
        break;
      default:
        return "Message...";
    }
  }
}

// Check for object with target or targets property
function checkObjectForTargetProperty(object) {
  try {
    if (!object)
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          `'${arguments.constructor.name}' must contain an argument!`
        )
      );
    if (object && !isObject(object))
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          "argument[0]",
          `'${arguments[0]}' must be an object!`
        )
      );
    if (object && (object.target || object.targets))
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          "object",
          `'${object}' must contain a property 'target' or 'targets'!`
        )
      );
    if (object && object.target && !isArray(object.target))
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          "object.target",
          `'${object.target}' must be a string for query selector!`
        )
      );
    if (object && object.targets && !isArray(object.targets))
      throw new Error(
        createLogMessageForFunction(
          arguments.constructor.name,
          "object.targets",
          `'${object.targets}' must be an array of query selectors!`
        )
      );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Functions to check variable datatypes
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

function createLogMessageForFunction(...argument) {
  switch (argument.length) {
    case 1:
      return `${argument[0]}`;
      break;
    case 2:
      return `${argument[0]}: ${argument[1]}`;
      break;
    case 3:
      return `${argument[0]}: ${argument[1]}: ${argument[2]}`;
      break;
    case 4:
      return `${argument[0]}: ${argument[1]}: ${argument[2]}: ${argument[3]}`;
      break;
    default:
      return "Message...";
  }
}

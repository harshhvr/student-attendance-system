// convert-into-ordinal-number.js

function convertIntoOrdinalNumberByQuerySelector(object) {
  try {
    if (!object) throw new Error(`${arguments.callee.name} needs an argument.`);

    if (arguments[0].constructor.name != "Object")
      throw new Error(
        `${arguments.callee.name}: arguments[0]: must be a object.`
      );

    if (!object.target)
      throw new Error(
        `${arguments.callee.name}: arguments[0]: [object]: needs a target property.`
      );

    if (object.target && typeof object.target != "string")
      throw new Error(
        `${arguments.callee.name}: arguments[0]: [object.target]: must be a string.`
      );
    if (object.text && typeof object.text != "string")
      throw new Error(
        `${arguments.callee.name}: arguments[0]: [object.text]: must be a string.`
      );

    const elements = document.querySelectorAll(object.target);

    if (elements.length === 0)
      throw new Error(
        `${arguments.callee.name}: arguments[0]: [object.target]: '${arguments[0].target}' is an invalid querySelector.`
      );

    elements.forEach((element, index) => {
      const elementInnerText = element.innerText;
      element.innerText = `${convertIntoOrdinalNumber(elementInnerText)} ${
        object.text || ""
      }`;
    });
  } catch (err) {
    console.log(err);
    return err;
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

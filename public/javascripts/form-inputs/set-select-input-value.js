// set-select-input-value.js

function setSelectInputValue(object) {
  try {
    const interval1 = setInterval(() => {
      if (object && (object.target || object.targets)) {
        // For a target
        if (object.target) {
          if (!isString(object.target))
            throw new Error(
              createLogMessageForFunction(
                arguments.callee.name,
                `object.target`,
                `'${object.target}' must be an array of query selectors!`
              )
            );

          if (isString(object.target) && object.target.length === 0)
            throw new Error(
              createLogMessageForFunction(
                arguments.callee.name,
                `object.targets`,
                `'${object.target}' must contains atleast a query selector!`
              )
            );

          const elements = document.querySelectorAll(target);

          if (!elements)
            throw new Error(
              createLogMessageForFunction(
                arguments.callee.name,
                `object.targets`,
                `'${object.targets}' is an invalid query selector!`
              )
            );

          elements.forEach((element, elementIndex) => {
            const elementDataValue = element.getAttribute("data-value");

            if (element && element.localName != "select")
              throw new Error(
                createLogMessageForFunction(
                  arguments.callee.name,
                  `object.targets[${elementIndex}]`,
                  `'${object.targets[elementIndex]}' must be a selector of <select> tag!`
                )
              );

            const options = element.querySelectorAll("option");

            options.forEach((option, optionIndex) => {
              const optionValue = option.value;

              option.removeAttribute("selected");

              if (optionValue === elementDataValue) {
                option.setAttribute("selected", "");
                clearInterval(interval1);
              } else {
                clearInterval(interval1);
              }
            });

            console.log(element);
          });
        }

        // For multiple targets
        if (object.targets) {
          if (!isArray(object.targets))
            throw new Error(
              createLogMessageForFunction(
                arguments.callee.name,
                `object.targets`,
                `'${object.targets}' must be an array of query selectors!`
              )
            );

          if (isArray(object.targets) && object.targets.length === 0)
            throw new Error(
              createLogMessageForFunction(
                arguments.callee.name,
                `object.targets`,
                `'${object.targets}' must contains atleast a query selector!`
              )
            );

          object.targets.forEach((target, targetIndex) => {
            const elements = document.querySelectorAll(target);

            if (!elements)
              throw new Error(
                createLogMessageForFunction(
                  arguments.callee.name,
                  `object.targets`,
                  `'${object.targets}' is an invalid query selector!`
                )
              );

            elements.forEach((element, elementIndex) => {
              const elementDataValue = element.getAttribute("data-value");

              if (element && element.localName != "select")
                throw new Error(
                  createLogMessageForFunction(
                    arguments.callee.name,
                    `object.targets[${elementIndex}]`,
                    `'${object.targets[elementIndex]}' must be a selector of <select> tag!`
                  )
                );

              const options = element.querySelectorAll("option");

              options.forEach((option, optionIndex) => {
                const optionValue = option.value;

                option.removeAttribute("selected");

                if (optionValue === elementDataValue) {
                  option.setAttribute("selected", "");
                  clearInterval(interval1);
                } else {
                  clearInterval(interval1);
                }
              });

              console.log(element);
            });
          });
        }
      }
    }, 100);

    // clearInterval(interval1);
  } catch (err) {
    console.log(err);
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

function isArray(arg) {
  return arg && arg.constructor && arg.constructor.name === "Array";
}
function isString(arg) {
  return arg && arg.constructor && arg.constructor.name === "String";
}

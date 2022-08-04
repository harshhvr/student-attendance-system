// FancyAlert.js

function clickMe(e) {
  console.log(e);
  console.log(e.dataset);
}

function fancyAlert(object) {
  if (object && object.confirm) {
    const myFancyAlert = new FancyAlert();
    myFancyAlert.confirm(object.confirm);
  }
}

function FancyAlert() {
  this.confirm = (object) => {
    try {
      const element = object;

      if (element.dataset && element.dataset.message) {
        const confirmMessage = confirm(element.dataset.message);

        if (confirmMessage) {
          const attributes = {
            keys: Object.keys(element.dataset),
            values: Object.values(element.dataset),
          };

          for (let i = 0; i < attributes.keys.length; i++) {
            element.setAttribute(attributes.keys[i], attributes.values[i]);
          }
        }
      }

      // element.addEventListener("click", (e) => {
      //   // console.log(element.dataset);
      //   if (element.dataset.message) {
      //     const confirmMessage = confirm(element.dataset.message);

      //     if (confirmMessage) {
      //       const attributes = {
      //         keys: Object.keys(element.dataset),
      //         values: Object.values(element.dataset),
      //       };

      //       for (let i = 0; i < attributes.keys.length; i++) {
      //         element.setAttribute(attributes.keys[i], attributes.values[i]);
      //       }
      //     }
      //   }
      // });
    } catch (err) {
      console.log(err);
    }
  };

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

// characters-in-blocks.js

function charactersInBlocks(object) {
  const obj = {
    style: {
      margin: "1px",
      padding: "1em",
      minWidth: "2.5em",
      borderRadius: "0.2rem",
      bgcolor: "#000000",
      color: "#fff",
      fontFamily: "'Ubuntu Mono', monospace",
    },
  };

  if (typeof object.style != "object" || Object.keys(object.style).length === 0) {
    object = { ...object, ...obj };
  } else {
    object = { ...obj, ...object };
  }

  // console.log(object);

  const cib = new CharactersInBlocks(object);
  cib.apply();
}

function CharactersInBlocks(object) {
  this.object = object;
  this.createMessage = (...argument) => {
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
  };
  this.createCB = (object) => {
    try {
      const elements = document.querySelectorAll(object.target);

      elements.forEach((element, index) => {
        const str = element.textContent.trim();

        element.textContent = "";

        element.style.display = "flex";
        element.style.flexWrap = "wrap";

        for (let i = 0; i < str.length; i++) {
          const cb = document.createElement("div");

          cb.style.display = "inline-block";
          cb.style.minWidth = "3em";
          cb.style.height = "inherit";
          cb.style.textAlign = "center";

          cb.style.margin = object.margin;
          cb.style.padding = object.padding;
          cb.style.borderRadius = object.borderRadius;

          cb.classList.add("cb");

          if (str.charAt(i) === " ") {
            cb.classList.add("cb-space");
          } else {
            cb.classList.add("cb-char");

            cb.style.backgroundColor = object.bgcolor;
            cb.style.color = object.color;
          }

          cb.textContent = str.charAt(i);

          element.appendChild(cb);
        }

        // console.log(element);
      });
    } catch (err) {
      console.log(err);
    }
  };
  this.createCBGroups = (object, getWordsFunc) => {
    try {
      const elements = document.querySelectorAll(object.target);

      elements.forEach((element, index) => {
        element.style.display = "flex";
        element.style.justifyContent = "center";
        element.style.alignItems = "center";
        element.style.flexWrap = "wrap";
        element.style.textAlign = "center";

        const str = element.innerText.trim();

        const wordArray = getWordsFunc(str);

        console.log(wordArray);

        element.innerText = "";

        element.style.display = "flex";
        element.style.flexWrap = "wrap";
        element.style.fontFamily = object.style.fontFamily;

        for (let i = 0; i < wordArray.length; i++) {
          const cbGroup = document.createElement("div");

          cbGroup.classList.add("cb-group");

          cbGroup.style.display = "inline-block";
          cbGroup.style.height = "inherit";

          cbGroup.style.minWidth = object.style.minWidth;

          for (let j = 0; j < wordArray[i].length; j++) {
            const cb = document.createElement("div");

            cb.style.display = "inline-block";
            cb.style.height = "inherit";
            cb.style.textAlign = "center";

            cb.style.margin = object.style.margin;
            cb.style.padding = object.style.padding;
            cb.style.minWidth = object.style.minWidth;
            cb.style.borderRadius = object.style.borderRadius;

            cb.classList.add("cb");

            if (wordArray[i].charAt(j) === " ") {
              cb.classList.add("cb-space");
            } else {
              cb.classList.add("cb-char");

              cb.style.backgroundColor = object.style.bgcolor;
              cb.style.color = object.style.color;
            }

            cb.textContent = wordArray[i].charAt(j);

            cbGroup.appendChild(cb);
          }

          element.appendChild(cbGroup);

          if (i < wordArray.length - 1) {
            const cbGroupEmpty = document.createElement("div");

            cbGroupEmpty.classList.add("cb-group");

            cbGroupEmpty.style.display = "inline-block";
            cbGroupEmpty.style.height = "inherit";

            cbGroupEmpty.style.minWidth = object.style.minWidth;

            element.appendChild(cbGroupEmpty);
          }
        }

        // console.log(element);
      });
    } catch (err) {
      console.log(err);
    }
  };
  this.getWords = (str) => {
    const word = [];

    let currentWord = "";
    let wordStart = 0;
    let wordLength = 0;

    try {
      if (!str)
        throw createMessage("getWords()", "This method need an argument.");
      if (typeof str != "string")
        throw this.createMessage(
          "getWords()",
          "This method need a string argument."
        );

      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === " ") {
          currentWord = str.substr(wordStart, wordLength);
          // console.log(currentWord);
          word.push(currentWord);
          wordStart = i + 1;
          wordLength = 0;
        } else if (i === str.length - 1 && wordStart != str.length) {
          currentWord = str.substr(wordStart, wordLength + 1);
          // console.log(currentWord);
          word.push(currentWord);
        } else {
          wordLength++;
        }
      }
    } catch (err) {
      console.log(`%c${err}`, "color:red;");
    }

    return word;
  };
  this.apply = () => {
    // this.createCB(this.object);
    this.createCBGroups(this.object, this.getWords);
    // console.log(this.getWords("Hii Harsh! Welcome to home."));
  };
}

// change-class-name.js

function changeClassName(arr) {
  for (let i = 0; i < arr.length; i++) {
    const elements = document.querySelectorAll(`.${arr[i][0]}`);

    elements.forEach((element, index) => {
      element.classList.remove(arr[i][0]);
      element.classList.add(arr[i][1]);
    });
  }
}

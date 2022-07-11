// requied-form-inputs.js

function showRequiredInputsByQuerySelector(...args) {
  const target = args[0];
  const elements = document.querySelectorAll(target);

  elements.forEach((element, index) => {
    const spanRequired = element.querySelector("span.required");
    if (spanRequired) {
      console.log(spanRequired);
    } else {
      element.classList.add("required");

      const span = document.createElement("span");
      span.innerHTML = "*";
      span.style.color = "red";

      element.appendChild(span);
    }
  });
}
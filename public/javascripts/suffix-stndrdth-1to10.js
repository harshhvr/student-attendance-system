// suffix-stndrdth-1to10.js

function stndrdth1to10Suffix(text) {
  const allNum = document.querySelectorAll(".suffix-1to10");

  console.log(allNum);

  allNum.forEach((item, index) => {
    const prevText = item.textContent;

    // const interval = setInterval(() => {
    //   item.innerHTML = "";
    //   item.innerHTML = `${prevText}<sup>${stndrdth1to10SuffixFunc(
    //     parseInt(prevText)
    //   )}</sup>${text}`;
    // }, 100);

    item.innerHTML = "";
    item.innerHTML = `${prevText}<sup>${stndrdth1to10SuffixFunc(
      parseInt(prevText)
    )}</sup>${text}`;
  });
}

function stndrdth1to10SuffixFunc(n) {
  if (n == 1) {
    return "st";
  } else if (n == 2) {
    return "nd";
  } else if (n == 3) {
    return "rd";
  } else if (n >= 4 && n <= 10) {
    return "th";
  } else {
    return "";
  }
}

"use strict";


function loadDoc() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "text.txt", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.getElementById("textarea").value = xhr.responseText;
    }
  };
  xhr.send();
}

document.getElementById("b1").addEventListener("click", loadDoc);


function loadDoc2() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "text.txt", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const lines = xhr.responseText.split("\n");
      const container = document.getElementById("textarea2");
      container.innerHTML = "";

      const colors = ["red", "blue", "green", "orange", "purple", "brown", "teal"];

      lines.forEach((line, index) => {
        const p = document.createElement("p");
        p.textContent = line;
        p.style.color = colors[index % colors.length];
        container.appendChild(p);
      });
    }
  };
  xhr.send();
}

document.getElementById("b2").addEventListener("click", loadDoc2);

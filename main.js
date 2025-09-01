const loadData = async function (file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Gagal ambil data JSON");
    return await response.json();
  } catch (err) {
    console.error("Error:", err);
  }
};

let globalValue = document.getElementById("global-value");

//menampilkan data surah
loadData("./surah.json").then((surah) => {
  let btnSurah = document.getElementById("btn-surah");
  let selectSurah = document.getElementById("select-surah");

  for (item of surah) {
    let option = document.createElement("option");
    option.value = item.title; // value
    option.textContent = item.title; // teks yang terlihat
    selectSurah.appendChild(option);
  }

  btnSurah.addEventListener("click", () => {
    selectSurah.style.display = "block";
  });
  
  selectSurah.addEventListener("click", () => {
    globalValue.innerHTML = selectSurah.value;
  })

  document.addEventListener("click", (el) => {
    if (el.target.innerText !== "Surah" && el.target.localName !== "option") {
      selectSurah.style.display = "none";
    }
  });
});



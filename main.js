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

const gameType = [
  "Apa Ayat Sesudahnya?",
  "Apa Ayat Sebelumnya?",
  "Tebak Nomor Ayat ini?",
  "Tebak Surat Dari Ayat ini?",
  "Apa Terjemahannya?",
];

//menampilkan data surah
loadData("./surah.json").then((surah) => {
  let btnSurah = document.getElementById("btn-surah");
  let selectSurah = document.getElementById("select-surah");

  for (let i = 77; i <= 113; i++) {
    let option = document.createElement("option");
    option.value = surah[i].title;
    option.textContent = surah[i].title;
    selectSurah.appendChild(option);
  }

  btnSurah.addEventListener("click", () => {
    selectSurah.style.display = "block";
  });

  selectSurah.addEventListener("click", () => {
    for (item of surah) {
      if (selectSurah.value === item.title) {
        globalValue.innerHTML = JSON.stringify(item);
      }
    }
  });

  document.addEventListener("click", (el) => {
    if (el.target.innerText !== "Surah" && el.target.localName !== "option") {
      selectSurah.style.display = "none";
    }
  });
});

let ques = document.getElementById("question");
let quest = document.getElementById("quest");
let startBtn = document.getElementById("start");

let fileNameSurah = Array.from({ length: 114 - 78 + 1 }, (_, i) => i + 78);

function randomData(countData) {
  if (countData.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * countData.length);
  const value = countData[randomIndex];
  countData.splice(randomIndex, 1);
  return value;
}
startBtn.addEventListener("click", () => {
  if (globalValue.innerHTML === "all") {
    loadData(`./surah/surah_${randomData(fileNameSurah)}.json`).then((res) => {
      let nameSurah = Array.from(
        { length: res.count - 1 + 1 },
        (_, i) => i + 1
      );
      console.log(res.name);
      console.log("all");
      ques.innerHTML = eval("res.verse.verse_" + randomData(nameSurah));
    });
  } else {
    let dataSurah = JSON.parse(globalValue.innerHTML);
    let idxSurah = parseInt(dataSurah.index)
    loadData(`./surah/surah_${idxSurah}.json`).then((res) => {
      let nameSurah = Array.from(
        { length: res.count - 1 + 1 },
        (_, i) => i + 1
      );
      ques.innerHTML = eval("res.verse.verse_" + randomData(nameSurah));
    });
  }
});

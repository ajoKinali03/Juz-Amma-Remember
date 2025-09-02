const loadData = async function (file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Gagal ambil data JSON");
    return await response.json();
  } catch (err) {
    console.error("Error:", err);
  }
};

// nilai global
let globalValue = document.getElementById("global-value");

// mengacak angka
function randomData(max, min) {
  let countData = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  if (countData.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * countData.length);
  const value = countData[randomIndex];
  countData.splice(randomIndex, 1);
  return value;
}

// array pertanyaan
let gameType = [
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

startBtn.addEventListener("click", () => {
  if (globalValue.innerHTML === "all") {
    loadData(`./surah/surah_${randomData(114, 78)}.json`).then((res) => {
      let verseId = randomData(res.count, 1);
      if (res.count === verseId) {
        gameType = gameType.filter((e) => e != "Apa Ayat Sesudahnya?");
        let curentGameType = gameType[randomData(gameType.length - 1, 0)];
        checkAnswer(verseId, res, curentGameType);
        quest.innerHTML = curentGameType;
        ques.innerHTML = eval("res.verse.verse_" + verseId);
      } else {
        let curentGameType = gameType[randomData(gameType.length - 1, 0)];
        checkAnswer(verseId, res, curentGameType);
        quest.innerHTML = curentGameType;
        ques.innerHTML = eval("res.verse.verse_" + verseId);
      }
    });
  } else {
    let dataSurah = JSON.parse(globalValue.innerHTML);
    let idxSurah = parseInt(dataSurah.index);
    loadData(`./surah/surah_${idxSurah}.json`).then((res) => {
      gameType = gameType.filter((e) => e != "Tebak Surat Dari Ayat ini?");
      quest.innerHTML = gameType[randomData(gameType.length - 1, 0)];
      ques.innerHTML = eval("res.verse.verse_" + randomData(res.count, 1));
    });
  }
});

// fungsi untuk menampilkan jawaban secara random
function checkAnswer(curent, data, curentQuest) {
  let key = randomData(4, 1);
  for (let i = 1; i <= 4; i++) {
    if (curentQuest === "Apa Ayat Sesudahnya?") {
      if (i == key) {
        document.getElementById(key).innerHTML = eval(
          "data.verse.verse_" + (curent + 1)
        );
      } else {
        document.getElementById(i).innerHTML = eval(
          "data.verse.verse_" + randomData(data.count, 1)
        );
      }
    } else if (curentQuest === "Apa Ayat Sebelumnya?") {
      if (i == key) {
        document.getElementById(key).innerHTML = eval(
          "data.verse.verse_" + (curent - 1)
        );
      } else {
        document.getElementById(i).innerHTML = eval(
          "data.verse.verse_" + randomData(data.count, 1)
        );
      }
    } else if (curentQuest === "Tebak Nomor Ayat ini?") {
      if (i == key) {
        document.getElementById(key).innerHTML = "Ayat ke-" + curent;
      } else {
        while (true) {
          let ayatIdx = randomData(data.count, 1);
          if (ayatIdx != curent) {
            document.getElementById(i).innerHTML = "Ayat ke-" + ayatIdx;
          } else {
            break;
          }
        }
      }
    } else if (curentQuest === "Tebak Surat Dari Ayat ini?") {
      if (i == key) {
        document.getElementById(key).innerHTML = data.name;
      } else {
        loadData("./surah").then((res) => {
          while (true) {
            // mengatur keluar nama surah
            let surahIdx = randomData(114, 78);
            if (true) {
              document.getElementById(i).innerHTML = "Surah ke-" + surahIdx;
            } else {
              break;
            }
          }
        });
      }
    } else if (curentQuest === "Apa Terjemahannya?") {
      document.getElementById(i).innerHTML = "";
    } else {
      console.error("pertanyaan tidak ditemukan");
    }
  }
}

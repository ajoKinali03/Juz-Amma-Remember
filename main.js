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
let inisiator = document.getElementById("inisiator");
// mengacak angka
function randomData(max, min, selain, array) {
  let countData = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  if (countData.length === 0) {
    return null;
  }
  if (selain) {
    countData = countData.filter((e) => {
      if (!selain.find((el) => el == e)) {
        return e;
      }
    });
  }
  const randomIndex = Math.floor(Math.random() * countData.length);
  const value = countData[randomIndex];
  countData.splice(randomIndex, 1);
  if (array) {
    countData.unshift(value);
    return countData;
  } else {
    return value;
  }
}

// let arrTst = [1, 3, 4, 1];

// for(let i = 1; i <= 5; i++){
//   randomData(5, 1, arrTst)
// };
//menyiapkan jawaban dan merandomkannya
function answerData(max, min, specialArr) {
  let arr = [];
  if (max <= 3 && specialArr[0] <= 3) {
    arr.push(0);
  }
  while (true) {
    let fileLoc = randomData(max, min, specialArr);
    arr.push(fileLoc);
    arr = [...new Set(arr)];
    if (arr.length == 3) {
      break;
    }
  }
  return arr;
}

// array pertanyaan
let gameType = [
  "Apa Ayat Sesudahnya?",
  "Apa Ayat Sebelumnya?",
  "Tebak Nomor Ayat ini?",
  "Tebak Nama Surat Dari Ayat ini?",
  "Apa Terjemahannya?",
];

function tipeQuest(quest) {
  let tipeObj = {
    ayat: ["Sesudah", "Sebelum"],
    nomor: "Nomor",
    nama: "Nama",
    terj: "Terjemahannya",
  };
  for (key in tipeObj) {
    if (typeof tipeObj[key] == "object") {
      if (quest.includes(tipeObj[key][0]) || quest.includes(tipeObj[key][1])) {
        return key;
      }
    } else {
      if (quest.includes(tipeObj[key])) {
        return key;
      }
    }
  }
}

//menampilkan data surah
loadData("./data/surah.json").then((surah) => {
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
    let curentGameType = gameType[randomData(gameType.length - 1, 0)];
    let idxFile = randomData(114, 78);
    loadData(`./data/surah/surah_${idxFile}.json`).then((res) => {
      let verseId = randomData(res.count, 1);
      if (res.count === verseId) {
        gameType = gameType.filter((e) => e != "Apa Ayat Sesudahnya?");
        quest.innerHTML = curentGameType;
        ques.innerHTML = eval("res.verse.verse_" + verseId);
        inisiator.innerHTML = JSON.stringify({
          gameType: curentGameType,
          totalAyat: res.count,
          ayatVerse: verseId,
          surahName: res.name,
          surahIdx: res.index,
          curentAyat: eval("res.verse.verse_" + verseId),
          beforeAyat: eval("res.verse.verse_" + (verseId - 1)),
          lastAyat: true,
          indexArray: idxFile - 1,
        });
      } else {
        let curentGameType = gameType[randomData(gameType.length - 1, 0)];
        quest.innerHTML = curentGameType;
        ques.innerHTML = eval("res.verse.verse_" + verseId);

        inisiator.innerHTML = JSON.stringify({
          gameType: curentGameType,
          totalAyat: res.count,
          ayatVerse: verseId,
          surahName: res.name,
          surahIdx: res.index,
          curentAyat: eval("res.verse.verse_" + verseId),
          beforeAyat: eval("res.verse.verse_" + (verseId - 1)),
          lastAyat: false,
          afterAyat: eval("res.verse.verse_" + (verseId + 1)),
          indexArray: idxFile - 1,
        });
      }
    });
  } else {
    let dataSurah = JSON.parse(globalValue.innerHTML);
    let idxSurah = parseInt(dataSurah.index);
    loadData(`./data/surah/surah_${idxSurah}.json`).then((res) => {
      gameType = gameType.filter((e) => e != "Tebak Nama Surat Dari Ayat ini?");
      let verseId = randomData(res.count, 1);
      let idxFile = parseInt(res.index);
      if (res.count === verseId) {
        gameType = gameType.filter((e) => e != "Apa Ayat Sesudahnya?");
        let curentGameType = gameType[randomData(gameType.length - 1, 0)];
        quest.innerHTML = curentGameType;
        ques.innerHTML = eval("res.verse.verse_" + verseId);
        inisiator.innerHTML = JSON.stringify({
          gameType: curentGameType,
          totalAyat: res.count,
          ayatVerse: verseId,
          surahName: res.name,
          surahIdx: res.index,
          curentAyat: eval("res.verse.verse_" + verseId),
          beforeAyat: eval("res.verse.verse_" + (verseId - 1)),
          lastAyat: true,
          indexArray: idxFile - 1,
        });
      } else {
        let curentGameType = gameType[randomData(gameType.length - 1, 0)];
        quest.innerHTML = curentGameType;
        ques.innerHTML = eval("res.verse.verse_" + verseId);

        inisiator.innerHTML = JSON.stringify({
          gameType: curentGameType,
          totalAyat: res.count,
          ayatVerse: verseId,
          surahName: res.name,
          surahIdx: res.index,
          curentAyat: eval("res.verse.verse_" + verseId),
          beforeAyat: eval("res.verse.verse_" + (verseId - 1)),
          lastAyat: false,
          afterAyat: eval("res.verse.verse_" + (verseId + 1)),
          indexArray: idxFile - 1,
        });
      }
    });
  }
});

//menyiapkan pilihan jawaban
let loading = document.getElementById("loading");
startBtn.addEventListener("click", () => {
  loading.style.display = "block"; //menampilkan teks loading
  document.getElementById("list-jawaban").style.display = "none";
  startBtn.disabled = true;

  setTimeout(() => {
    // mengambil data yang di simpan pada element html
    let data = JSON.parse(inisiator.innerHTML);
    let arrAnswer = []; //kumpulan jawabn dengan maksimal tampungan 3 data

    if (tipeQuest(data.gameType) === "ayat") {
      let arrFileLoc = answerData(114, 78, [parseInt(data.surahIdx)]); //mengambil data random dengan pengecualian index file tertentu
      for (idx of arrFileLoc) {
        loadData(`./data/surah/surah_${idx}.json`).then((res) => {
          if (data.lastAyat) {
            if (data.gameType === "Apa Ayat Sebelumnya?") {
              if (arrAnswer.length == 0) {
                arrAnswer.push([data.beforeAyat, true]);
              } else {
                arrAnswer.push(
                  eval("res.verse.verse_" + randomData(res.count, 1))
                );
              }
              if (arrAnswer.length == arrFileLoc.length) {
                showAnswer(arrAnswer);
              }
            }
          } else {
            if (data.gameType === "Apa Ayat Sesudahnya?") {
              if (arrAnswer.length == 0) {
                arrAnswer.push([data.afterAyat, true]);
              } else {
                arrAnswer.push(
                  eval("res.verse.verse_" + randomData(res.count, 1))
                );
              }
              if (arrAnswer.length == arrFileLoc.length) {
                showAnswer(arrAnswer);
              }
            }
            if (data.gameType === "Apa Ayat Sebelumnya?") {
              if (arrAnswer.length == 0) {
                arrAnswer.push([data.beforeAyat, true]);
              } else {
                arrAnswer.push(
                  eval("res.verse.verse_" + randomData(res.count, 1))
                );
              }
              if (arrAnswer.length == arrFileLoc.length) {
                showAnswer(arrAnswer);
              }
            }
          }
        });
      }
      document.getElementById("list-jawaban").style.display = "block"; //menampilkan pilihan jawabn
    } else if (tipeQuest(data.gameType) === "nomor") {
      let arrnNumAyah = answerData(data.totalAyat, 1, [data.ayatVerse]);
      for (idx of arrnNumAyah) {
        if (arrAnswer.length == 0) {
          arrAnswer.push(["Ayat ke-" + data.ayatVerse, true]);
        } else {
          arrAnswer.push("Ayat ke-" + idx);
        }
        if (arrAnswer.length == arrnNumAyah.length) {
          showAnswer(arrAnswer);
        }
      }
      document.getElementById("list-jawaban").style.display = "block"; //menampilkan pilihan jawabn
    } else if (tipeQuest(data.gameType) === "nama") {
      loadData("./data/surah.json").then((res) => {
        setTimeout(async () => {
          let idxName = res[data.indexArray].title;
          let namaAyt = answerData(114, 78, [idxName]);
          let arrTakeName = await Promise.all(res.map((e) => e.title));
          for (idx of namaAyt) {
            if (arrAnswer.length == 0) {
              arrAnswer.push([idxName, true]);
            } else {
              arrAnswer.push(arrTakeName[idx]);
            }
            if (arrAnswer.length == namaAyt.length) {
              showAnswer(arrAnswer);
            }
          }
        });
      }, 100);

      document.getElementById("list-jawaban").style.display = "block";
    } else if (tipeQuest(data.gameType) === "terj") {
      loadData(`./data/id/id_translation_${parseInt(data.surahIdx)}.json`).then(
        (res) => {
          let terjAyt = answerData(data.totalAyat, 1, [data.ayatVerse]);
          for (idx of terjAyt) {
            if (arrAnswer.length == 0) {
              arrAnswer.push([eval("res.verse.verse_" + data.ayatVerse), true]);
            } else {
              arrAnswer.push(eval("res.verse.verse_" + idx));
            }
            if (arrAnswer.length == terjAyt.length) {
              showAnswer(arrAnswer);
            }
          }
        }
      );

      document.getElementById("list-jawaban").style.display = "block";
    }
    startBtn.disabled = false;
    loading.style.display = "none"; //menghapus teks loading
  }, 1000);
});

// menampilkan pilihan jawaban
// tinggal membuat fungsi cek jawaban
function showAnswer(arr) {
  let indexRandom = randomData(3, 1, false, true);
  arr.forEach((e, i) => {
    if (typeof e == "object") {
      document.getElementById(`${indexRandom[i]}`).innerHTML = e[0];
    } else {
      if (i != indexRandom) {
        document.getElementById(`${indexRandom[i]}`).innerHTML = e;
      }
    }
  });
}

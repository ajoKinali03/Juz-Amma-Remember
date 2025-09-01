const loadData = async function (file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Gagal ambil data JSON");
    return await response.json();
  } catch (err) {
    console.error("Error:", err);
  }
};

loadData("./surah.json").then((surah) => {
  for(item of surah){
    if(item.place === "Mecca"){
      console.log(item)
    };
  };
});

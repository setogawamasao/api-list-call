const fetch = require("node-fetch");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");

const main = async () => {
  console.log("process start");

  // ファイル読み込み
  const text = fs.readFileSync("./in.csv", "utf8");
  const lines = text.toString().split("\r\n");

  const inputValues = [];
  for (const line of lines) {
    inputValues.push(line);
  }

  // APIよりデータ取得
  const jsons = [];
  for (const inputValue of inputValues) {
    const response = await fetch(`http://localhost:8080/${inputValue}`);

    const json = await response.json();

    jsons.push(json);
  }

  // csv　データ作成
  // ヘッダーの作成
  const fields = [];
  for (const key in jsons[0]) {
    fields.push(key);
  }

  // json -> csv変換
  const json2csvParser = new Json2csvParser({ fields, header: true });
  const csv = json2csvParser.parse(jsons);

  // csv　ファイル書き出し
  fs.writeFile(`out${getNow()}.csv`, csv, (err, data) => {
    if (err) console.log(err);
    else console.log("process e n d");
  });
};

// システム日付取得
const getNow = () => {
  const dt = new Date();
  const yy = dt.getFullYear();
  const mm = ("00" + (dt.getMonth() + 1)).slice(-2);
  const dd = ("00" + dt.getDate()).slice(-2);
  const hh = ("00" + dt.getHours()).slice(-2);
  const mi = ("00" + dt.getMinutes()).slice(-2);
  const ss = ("00" + dt.getSeconds()).slice(-2);
  var result = yy + mm + dd + hh + mi + ss;
  return result;
};

//　処理開始
main();

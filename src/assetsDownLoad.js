const https = require("https");
const fs = require("original-fs");
const { app } = require("electron");
const { createSplash } = require("./createWindow");

const assetsDownLoad = async (filename, type, link) => {
  try {
    return await new Promise((resolve, reject) => {
      const req = https.get(link, async (res) => {
        console.log(res.statusCode);
        // console.log(res);
        if (res.statusCode === 302 || res.statusCode === 303) {
          console.log(res.headers.location);
          const download = await assetsDownLoad(
            filename,
            type,
            res.headers.location,
          );
          console.log(download);
          resolve(download);
          return;
        }

        let dir = "";

        if (!fs.existsSync(app.getPath("userData") + "/assets")) {
          fs.mkdirSync(app.getPath("userData") + "/assets");
        }
        switch (type) {
          case "背景":
            dir = "/assets/background/";
            break;
          case "キャラクター":
            dir = "/assets/character/";

            break;
          case "音声":
            dir = "/assets/audio/";
            break;

          default:
            break;
        }

        if (!fs.existsSync(app.getPath("userData") + dir)) {
          fs.mkdirSync(app.getPath("userData") + dir);
        }

        const outURL = app.getPath("userData") + dir + filename;

        const splash = await createSplash()
        let total = 0; // 合計byte数
        let percent = 0; // %
        console.log(splash);
        res.on("data", (chunk) => {
          total += chunk.length; // これまで読み取ったbyte数
          const length = res.headers["content-length"];
          if (percent !== parseInt((total / length) * 100)) {
            percent = parseInt((total / length) * 100);
            console.log(`${percent} %`);
            splash.webContents.send('loadingData', percent)
          }
        });
        const outFile = fs.createWriteStream(outURL);
        res.pipe(outFile);

        // 終わったらファイルストリームをクローズ。
        res.on("end", () => {
          console.log("end");
          console.log(outURL);
          outFile.close();
          splash.close()
          resolve(true); // trueを返す
        });
      });

      // エラーがあれば扱う。
      req.on("error", (err) => {
        console.log("Error: ", err);
        reject(false); // falseを返す
      });
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

exports.assetsDownLoad = assetsDownLoad;

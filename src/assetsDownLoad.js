const https = require("https");
const fs = require("original-fs");
const { app, BrowserWindow } = require("electron");

/**
 *
 * @param {string} link
 * @param {BrowserWindow} splash
 * @returns
 */
const getAssetsList = async (link, splash) => {
  try {
    return await new Promise((resolve, reject) => {
      const req = https.get(link, (res) => {
        let data = "";
        res.on("data", (d) => {
          data += d;
        });
        res.on("end", async () => {
          const json = JSON.parse(data);
          for (const filename of Object.keys(json)) {
            console.log(filename);
            console.log(json[filename]["type"]);
            console.log(json[filename]["link"]);
            await assetsDownLoad(
              filename,
              json[filename]["type"],
              json[filename]["link"] +
                "?rand=" +
                Math.floor(Math.random() * 100),
              splash
            );
          }
          resolve(true);
        });
      });

      req.on("error", (error) => {
        console.log(error);
        reject(false);
      });
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

/**
 *
 * @param {string} filename
 * @param {string} type
 * @param {string} link
 * @param {BrowserWindow} splash
 * @returns
 */
const assetsDownLoad = async (filename, type, link, splash) => {
  try {
    return await new Promise((resolve, reject) => {
      const req = https.get(link, async (res) => {
        console.log(res.statusCode);
        if (
          res.statusCode === 302 ||
          res.statusCode === 303
        ) {
          const download = await assetsDownLoad(
            filename,
            type,
            res.headers.location,
            splash
          );
          console.log(download);
          resolve(download);
          return;
        }

        if (res.statusCode === 403) {
          resolve(false)
          return;
        }

        let dir = "";
        const dataPath = app.getPath("userData");
        if (!fs.existsSync(dataPath + "/assets")) {
          fs.mkdirSync(dataPath + "/assets");
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

        if (!fs.existsSync(dataPath + dir)) {
          fs.mkdirSync(dataPath + dir);
        }

        const outURL = dataPath + dir + filename;

        let total = 0; // 合計byte数
        let percent = 0; // %
        res.on("data", (chunk) => {
          total += chunk.length; // これまで読み取ったbyte数
          const length = res.headers["content-length"];
          if (percent !== parseInt((total / length) * 100)) {
            percent = parseInt((total / length) * 100);
            console.log(`${percent} %`);
            splash.webContents.send("loadingData", percent);
          }
        });
        const outFile = fs.createWriteStream(outURL);
        res.pipe(outFile);

        // 終わったらファイルストリームをクローズ。
        res.on("end", () => {
          console.log("end");
          console.log(outURL);
          outFile.close();
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
exports.getAssetsList = getAssetsList;

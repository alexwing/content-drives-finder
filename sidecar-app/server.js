const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const settings = require("./backend/settings.js");
const search = require("./backend/search.js");
const processDrive = require("./backend/process.js");
const bookmarks = require("./backend/bookmarks.js");
const folderSync = require("./backend/folderSync.js");
const fileCleaner = require("./backend/fileCleaner.js");

const app = express();
console.log("Leyendo configuración...");
const configPath = path.join(process.cwd(), "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
app.set('config', config);
console.log("Configuración leída correctamente de: ", configPath);
console.log("Carpeta de trabajo: ", config.folder);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

const port = process.env?.PORT || 3000;

settings(app);
search(app);
processDrive(app);
bookmarks(app);
folderSync(app);
fileCleaner(app);

app.listen(port, () => {
  console.log(`The app is listening on http://localhost:${port}/settings`);
});

import { readFileSync, writeFileSync } from "node:fs";
import { argv } from "node:process";

const { version } = JSON.parse(readFileSync("./package.json"));

const manifest = JSON.stringify({
  addons: {
    [argv[2]]: {
      updates: [{
        version,
        update_link: "https://github.com/hazzik/mh-search-assist/releases/latest/download/mh-search-assist.xpi",
      }],
    },
  },
});
writeFileSync("./web-ext-artifacts/update.json", manifest);

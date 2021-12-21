import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { argv } from 'process';
const { version } = JSON.parse(readFileSync('./package.json'));
const file = readdirSync('./web-ext-artifacts/').pop();

const manifest = JSON.stringify({ 
    addons: {
        [argv[2]]: {
            updates: [{
                version,
                update_link: `https://hazzik.github.io/mh-search-assist/web-ext-artifacts/${file}`
            }]
        }
    }
});
writeFileSync('./update.json.tmp', manifest);
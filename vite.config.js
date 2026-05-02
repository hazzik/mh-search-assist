import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";

const rootDir = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
    readFileSync(resolve(rootDir, "package.json"), "utf8")
);

function createManifest() {
    const manifest = JSON.parse(
        readFileSync(resolve(rootDir, "src/manifest.json"), "utf8")
    );

    manifest.version = packageJson.version;
    delete manifest.$schema;

    if (process.env.AMO_EXTENSION_ID) {
        manifest.browser_specific_settings = {
            ...manifest.browser_specific_settings,
            gecko: {
                ...manifest.browser_specific_settings?.gecko,
                id: process.env.AMO_EXTENSION_ID,
            },
        };
    }

    return JSON.stringify(manifest, null, 2);
}

function extensionManifestPlugin() {
    return {
        name: "extension-manifest",
        generateBundle() {
            this.emitFile({
                type: "asset",
                fileName: "manifest.json",
                source: createManifest(),
            });
        },
    };
}

export default defineConfig({
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
        assetsInlineLimit: Number.MAX_SAFE_INTEGER,
        rollupOptions: {
            input: resolve(rootDir, "src/index.js"),
            output: {
                entryFileNames: "main.js",
                assetFileNames: (assetInfo) => (
                    assetInfo.name?.endsWith(".css") ? "main.css" : "assets/[name][extname]"
                ),
            },
        },
    },
    plugins: [extensionManifestPlugin()],
});
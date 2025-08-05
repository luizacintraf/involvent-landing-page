import esbuild from "esbuild";
import fs from 'fs';
import { exec } from "child_process";
import { globSync } from 'glob';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const AUTO_FOCUS_ENABLED = false;

/**
 * Push build products into production
 */
const push = () => {
    console.log("\n⬆️  Pushing...");

    exec("echo 'y' | npx clasp push", (err, stdout) => {
        if (err) {
            console.log(`\n🚨 Push failed with following error:\n`)
            throw new Error(err)
        }

        console.log(stdout)
        openOrRefresh()
    })
}

let isWatching = false;
/**
 * Start watching for changes
 */
const watch = () => {
    if (!isWatching) {
        if (deploymentId) {
            console.log(`\n🌐 Your app is available at: https://script.google.com/macros/s/${deploymentId}/exec\n`)
            console.log(`Remember to configure the deployment settings at: https://script.google.com/home/projects/${scriptId}/deployments\n`)
        }
        console.log(`🔄 Watching for changes...\n`)
        isWatching = true;

        fs.watch("./src", { recursive: true }, async event => {
            if (event === "change") {
                await buildClient();
                push();
            }
        })
    }
}

let deploymentId = null;
let scriptId = null;

// Get Script ID from .clasp.json
try {
    const claspConfig = JSON.parse(fs.readFileSync('.clasp.json', 'utf8'));
    scriptId = claspConfig.scriptId;
} catch (error) {
    console.log('⚠️  Could not read .clasp.json file');
}

/**
 * Opens or refreshes the deployment
 */
const openOrRefresh = () => {
    if (deploymentId === null) {
        // Get @HEAD deployment ID
        exec("npx clasp deployments | grep '@HEAD' | cut -d ' ' -f2", (err, stdout) => {
            if (err) {
                console.log(`\n🚨 OpenOrRefresh failed with following error:\n`)
                throw new Error(err)
            }
            
            deploymentId = stdout.toString().trim();
            console.log(`\n🌐 Your app is available at: https://script.google.com/macros/s/${deploymentId}/exec`)
            console.log(`\nRemember to configure the deployment settings at: https://script.google.com/home/projects/${scriptId}/deployments\n`)
            watch();
        })
    } else {
        watch();
    }
}

/**
 * Build configuration for Client files
 */
const buildClient = async () => {
    const htmlTemplate = (js, css) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google Apps Script React App</title>
        <style>${css}</style>
    </head>
    <body>
        <div id="root"></div>
        <script>${js}</script>
    </body>
</html>`

    // Process CSS with PostCSS (Tailwind)
    const processCss = async () => {
        const css = fs.readFileSync('./src/styles.css', 'utf8');
        const result = await postcss([
            tailwindcss,
            autoprefixer,
        ]).process(css, {
            from: './src/styles.css',
            to: './dist/styles.css'
        });
        return result.css;
    };

    return esbuild
        .build({
            entryPoints: ["src/index.js"],
            outfile: "dist/bundle.js",
            bundle: true,
            minify: true,
            sourcemap: false,
            format: 'iife',
            target: ['es2015'],
            loader: { 
                '.js': 'jsx',
                '.jsx': 'jsx',
                '.png': 'dataurl',
                '.jpg': 'dataurl',
                '.jpeg': 'dataurl',
                '.gif': 'dataurl',
                '.svg': 'dataurl',
                '.css': 'css'
            },
            assetNames: 'assets/[name]-[hash]',
            publicPath: '/assets/'
        })
        .then(async () => {
            const js = fs.readFileSync("./dist/bundle.js", { encoding: "utf-8" });
            const css = await processCss();
            fs.writeFileSync("./dist/index.html", htmlTemplate(js, css));
            fs.copyFileSync("./Code.gs", "./dist/Code.gs");
            fs.copyFileSync("./dist/appsscript.json", "./dist/appsscript.json");
        })
        .then(() => {
            fs.rmSync("./dist/bundle.js");
            console.log("✅ Build complete!")
        })
        .catch((error) => {
            console.log(`❌ Build failed!\n\n${error}`);
            process.exit(1)
        });
}

/**
 * Main build process
 */
const main = async () => {
    try {
        await buildClient();
        push();
    }
    catch (e) {
        process.exit(1);
    }
}

// Check if watch mode is enabled
const watchMode = process.argv.includes('--watch');
if (watchMode) {
    console.log('🔄 Starting in watch mode...');
    watch();
}

main(); 
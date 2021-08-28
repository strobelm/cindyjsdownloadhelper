import { takeCindyJSScreenshot } from "./src/cindyscreenshot.js";

const args = process.argv.slice(2);
if (args.length != 2) {
    throw new Error(
        "please provide the input file and the output file: e.g. node cindyscreenshot.js construction.html outputDir"
    );
}

await takeCindyJSScreenshot(args);

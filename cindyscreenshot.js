const puppeteer = require("puppeteer");
const fs = require("fs");

const args = process.argv.slice(2);
if (args.length != 2) {
    throw new Error(
        "please provide the input file and the output file: e.g. node cindyscreenshot.js construction.html output.pdf"
    );
}

const [input, output] = args;

(async () => {
    // launch a new chrome instance
    const browser = await puppeteer.launch({
        // headless: false,
    });

    // create a new page
    const page = await browser.newPage();
    await page.goto("file://" + input);
    await page.waitForTimeout(1000);

    // get CSCanvas as PNG Image
    const dataUrl = await page.evaluate(async () => {
        return document.getElementById("CSCanvas").firstChild.toDataURL();
    });

    page.setContent(getHTMLWrapper(dataUrl));

    await page.pdf({
        format: "A4",
        path: output,
    });

    // close the browser
    await browser.close();
})();

function getHTMLWrapper(dataURL) {
    return `<!DOCTYPE html>
<html>
<body>
<img src="${dataURL}">
</body>
</html>
`;
}

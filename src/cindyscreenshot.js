import puppeteer from "puppeteer";

const args = process.argv.slice(2);
if (args.length != 2) {
    throw new Error(
        "please provide the input file and the output file: e.g. node cindyscreenshot.js construction.html outputDir"
    );
}

export async function takeCindyJSScreenshot() {
    const [input, output] = args;

    // launch a new chrome instance
    const browser = await puppeteer.launch({
        // headless: false,
        // devtools: true,
    });

    // create a new page
    const page = await browser.newPage();
    await page.goto("file://" + input);
    await page.waitForTimeout(500);

    await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: output,
    });

    const dataUrl = await page.evaluate(async () => {
        if (window.cdy) {
            window.cdy.exportPDF();
        } else {
            const dataUrl = document.getElementById("CSCanvas").firstChild.toDataURL();
            return dataUrl;
        }
    });

    if (dataUrl) {
        page.setContent(getHTMLWrapper(dataUrl));
        await page.pdf({
            format: "A4",
            path: output + "/CindyJSExport.pdf",
        });
    }
    await page.waitForTimeout(500);

    // close the browser
    await browser.close();
}

function getHTMLWrapper(dataURL) {
    return `<!DOCTYPE html>
<html>
<body>
<img src="${dataURL}">
</body>
</html>
`;
}

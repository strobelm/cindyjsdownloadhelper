import puppeteer from "puppeteer";
import fs from "fs";

export async function takeCindyJSScreenshot(args) {
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
        if (!fs.existsSync(output)) {
            fs.mkdirSync(output);
        }
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

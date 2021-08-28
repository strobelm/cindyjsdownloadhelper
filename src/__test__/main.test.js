import { takeCindyJSScreenshot } from "../cindyscreenshot.js";
import fs from "fs";

for (const file of ["01_sunflower.html", "01_sunflower_no_var.html"]) {
    test("take screenshot with pdf " + file, async () => {
        const path = "/tmp/" + Math.random().toString(36).substr(2, 5);
        const args = [__dirname + "/data/" + file, path];

        await takeCindyJSScreenshot(args);

        expect(fs.existsSync(path + "/CindyJSExport.pdf")).toBeTruthy();
    });
}

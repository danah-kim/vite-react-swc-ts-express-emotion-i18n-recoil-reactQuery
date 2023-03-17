import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resolve = (p: string) => path.resolve(__dirname, p);

const getStyleSheets = async () => {
  try {
    const assetPath = resolve("dist/client/assets");
    const cssAssets = (await fs.readdir(assetPath)).filter((l) =>
      l.endsWith(".css")
    );
    const allContent = [];

    for (const asset of cssAssets) {
      const content = await fs.readFile(path.join(assetPath, asset), "utf-8");

      allContent.push(`<style type="text/css">${content}</style>`);
    }

    return allContent.join("\n");
  } catch {
    return "";
  }
};

const toAbsolute = (p: string) =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), p);

const routesToPrerender = (await fs.readdir(toAbsolute("src/pages"))).map(
  (file) => {
    const name = file.replace(/\.tsx$/, "").toLowerCase();

    return name === "home" ? "/" : `/${name}`;
  }
);

(async () => {
  for (const url of routesToPrerender) {
    const filePath = `dist/static${url === "/" ? "/index" : url}.html`;

    await fs.writeFile(
      toAbsolute(filePath),
      await fs
        .readFile(toAbsolute("dist/static/index.html"), "utf-8")
        // @ts-ignore
        .replace(
          "<!--app-html-->",
          // @ts-ignore
          (await import("./dist/server/entry-server.js")).render(url)
        )
        .replace("<!--app-styles-->", await getStyleSheets())
    );
    console.log("pre-rendered:", filePath);
  }
})();

import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import type { Request, Response } from "express";
import express from "express";
import fs from "fs/promises";
import helmet from "helmet";
import path from "path";
import serveStatic from "serve-static";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const isTest = process.env.NODE_ENV === "test" || process.env.VITEST;
const isProd = process.env.NODE_ENV === "production";
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

async function createServer() {
  const app = express();
  const vite = await createViteServer({
    root: process.cwd(),
    logLevel: isTest ? "error" : "info",
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    appType: "custom",
  });

  const requestHandler = express.static(resolve("assets"));
  app.use(requestHandler);
  app.use("/assets", requestHandler);
  app.use(compression());
  app.use(
    serveStatic(resolve("dist/client"), {
      index: false,
    })
  );

  app.use(vite.middlewares);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.set("trust proxy", true);
  app.disable("x-powered-by");
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use("*", async (req: Request, res: Response) => {
    const url = req.originalUrl;

    try {
      let template = await fs.readFile(
        resolve(isProd ? "dist/client/index.html" : "index.html"),
        "utf-8"
      );
      const { render } = await vite.ssrLoadModule(
        path.join(
          __dirname,
          isProd ? "dist/server/entry-server.js" : "src/entry-server.tsx"
        )
      );

      template = await vite.transformIndexHtml(url, template);

      res
        .status(200)
        .set({ "Content-Type": "text/html" })
        .end(
          template
            .replace("<!--app-html-->", await render(url))
            .replace("<!--app-styles-->", await getStyleSheets())
        );
    } catch (e: any) {
      !isProd && vite.ssrFixStacktrace(e);
      res.status(500).end(e.stack);
    }
  });

  app.listen(PORT, () => {
    console.log(`✅  server Listening on: ${PORT}`);
  });
}

if (!isTest) {
  createServer();
}

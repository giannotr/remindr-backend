"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createRemindrApp: () => createRemindrApp
});
module.exports = __toCommonJS(index_exports);

// src/createApp.ts
var import_express3 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_node_path = __toESM(require("path"), 1);

// src/routes/items.ts
var import_express = require("express");

// src/env.ts
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var env = {
  n8nBaseUrl: required("N8N_BASE_URL"),
  n8nApiKey: required("N8N_API_KEY"),
  n8nTableId: required("N8N_TABLE_ID"),
  pinCode: required("PIN_CODE")
};
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env variable: ${name}`);
  }
  return value;
}

// src/n8n.ts
var n8nHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-N8N-API-KEY": env.n8nApiKey
};
var n8nRowsUrl = `${env.n8nBaseUrl}/api/v1/data-tables/${env.n8nTableId}/rows`;

// src/routes/items.ts
function createItemsRouter(mapItemToRow, matchKey = "id") {
  const router = (0, import_express.Router)();
  router.get("/", async (_req, res) => {
    const response = await fetch(n8nRowsUrl, {
      headers: n8nHeaders
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });
  router.post("/", async (req, res) => {
    const { body } = req;
    const response = await fetch(n8nRowsUrl, {
      method: "POST",
      headers: n8nHeaders,
      body: JSON.stringify({
        data: [
          mapItemToRow({
            id: body.id,
            label: body.label,
            checked: false
          })
        ]
      })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });
  router.patch("/:id", async (req, res) => {
    const { body } = req;
    const response = await fetch(`${n8nRowsUrl}/update`, {
      method: "PATCH",
      headers: n8nHeaders,
      body: JSON.stringify({
        filter: {
          type: "and",
          filters: [
            {
              columnName: matchKey,
              condition: "eq",
              value: req.params.id
            }
          ]
        },
        data: {
          checked: body.checked
        }
      })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });
  router.delete("/:id", async (req, res) => {
    const filter = {
      type: "and",
      filters: [
        {
          columnName: matchKey,
          condition: "eq",
          value: req.params.id
        }
      ]
    };
    const params = new URLSearchParams({
      filter: JSON.stringify(filter)
    });
    const response = await fetch(`${n8nRowsUrl}/delete?${params}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "X-N8N-API-KEY": n8nHeaders["X-N8N-API-KEY"]
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });
  return router;
}

// src/routes/auth.ts
var import_express2 = require("express");
var authRouter = (0, import_express2.Router)();
authRouter.post("/", async (req, res) => {
  const { body } = req;
  const authCheck = body.pinCode === env.pinCode;
  res.status(200).json({ authCheck });
});

// src/createApp.ts
function createRemindrApp(options) {
  const app = (0, import_express3.default)();
  app.use(import_express3.default.json());
  app.use((0, import_cors.default)({
    origin: [
      process.env.APP_DEV_URL ?? "",
      process.env.APP_PUBLIC_URL ?? ""
    ]
  }));
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/items", createItemsRouter(options.mapItemToRow, options.matchKey ?? "id"));
  app.use("/api/auth", authRouter);
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    const frontendDistPath = import_node_path.default.resolve(process.cwd(), options.clientPath);
    app.use(import_express3.default.static(frontendDistPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_node_path.default.join(frontendDistPath, "index.html"));
    });
  }
  return app;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createRemindrApp
});

// src/createApp.ts
import express from "express";
import cors from "cors";
import "path";

// src/routes/items.ts
import { Router } from "express";

// src/env.ts
import dotenv from "dotenv";
dotenv.config();
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
  const router = Router();
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
import { Router as Router2 } from "express";
var authRouter = Router2();
authRouter.post("/", async (req, res) => {
  const { body } = req;
  const authCheck = body.pinCode === env.pinCode;
  res.status(200).json({ authCheck });
});

// src/createApp.ts
function createRemindrApi(options) {
  const app = express();
  app.use(express.json());
  app.use(cors({
    origin: [
      process.env.APP_DEV_URL ?? "",
      process.env.APP_PUBLIC_URL ?? ""
    ]
  }));
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/items", createItemsRouter(
    options.mapItemToRow,
    options.matchKey ?? "id"
  ));
  app.use("/api/auth", authRouter);
  return app;
}
export {
  createRemindrApi
};

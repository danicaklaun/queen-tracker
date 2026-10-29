import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AuthController } from "./WebAPI/controllers/AuthController";
import { AdminController } from "./WebAPI/controllers/AdminController";
import { CatalogController } from "./WebAPI/controllers/CatalogController";
import { HiveController } from "./WebAPI/controllers/HiveController";
import { QueenController } from "./WebAPI/controllers/QueenController";
import { DashboardController } from "./WebAPI/controllers/DashboardController";
import { QueenHiveAssignmentController } from "./WebAPI/controllers/QueenHiveAssignmentController";

import { authMiddleware } from "./Middlewares/AuthMiddleware";
import { authorizeMiddleware } from "./Middlewares/AuthorizeMiddleware";

import { QueenQualityController } from "./WebAPI/controllers/QueenQualityController";
dotenv.config();

const app = express();
console.log("APP STARTED");

app.use(cors());
app.use(express.json({ limit: "10mb" }));

console.log("REGISTERING AUTH ROUTES");
// Controllers
app.use("/api/auth", new AuthController().router);
app.use("/api/admin", new AdminController().router);
app.use("/api/catalogs", new CatalogController().router);
app.use("/api/hives", new HiveController().router);
app.use("/api/queens", new QueenController().router);
app.use("/api/dashboard", new DashboardController().router);
app.use(
    "/api/queen-hive-assignments",
    new QueenHiveAssignmentController().router
);
app.use(
    "/api/queen-quality-checks",
    new QueenQualityController().router
);

app._router?.stack.forEach((r: any) => {
  if (r.route) {
    console.log(r.route.path, Object.keys(r.route.methods));
  } else if (r.name === "router") {
    r.handle.stack.forEach((s: any) => {
      if (s.route) {
        console.log(s.route.path, Object.keys(s.route.methods));
      }
    });
  }
});

// Test authenticated user
app.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.get("/test", (_req, res) => {
  res.send("TEST OK");
});

// Test admin authorization
app.get(
  "/api/admin/test",
  authMiddleware,
  authorizeMiddleware("admin"),
  (_req, res) => {
    res.json({
      success: true,
      message: "Admin ruta radi.",
    });
  }
);

export default app;
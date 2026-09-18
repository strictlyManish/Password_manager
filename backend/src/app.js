const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

const { csrfProtection } = require("./utils/csrf");
const user_route = require("./routes/user.route");
const vault_route = require("./routes/vault.route");

const sanitizeInput = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeInput);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((acc, [key, item]) => {
      if (key.startsWith("$") || key.includes(".")) {
        return acc;
      }

      acc[key] = sanitizeInput(item);
      return acc;
    }, {});
  }

  if (typeof value === "string") {
    return value.replace(/[<>]/g, "").trim();
  }

  return value;
};

const app = express();
const baseOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: baseOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use((req, _res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }

  if (req.query) {
    req.query = sanitizeInput(req.query);
  }

  if (req.params) {
    req.params = sanitizeInput(req.params);
  }

  next();
});

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server healthy" });
});

app.get("/auth/csrf", csrfProtection, (req, res) => {
  res.status(200).json({ success: true, csrfToken: req.csrfToken() });
});

app.use("/auth", user_route);
app.use("/vault", vault_route);

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed. Please refresh and try again.",
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
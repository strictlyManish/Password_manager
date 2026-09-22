const crypto = require("crypto");

const CSRF_COOKIE_NAME = "_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";

const timingSafeCompare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};


const issueCsrfToken = (req, res) => {
  let token = req.cookies?.[CSRF_COOKIE_NAME];

  if (!token) {
    token = crypto.randomBytes(32).toString("hex");

    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });
  }

  req.csrfToken = () => token;
  return token;
};

const csrfProtection = (req, res, next) => {
  const method = req.method?.toUpperCase() || "GET";

  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    issueCsrfToken(req, res);
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || !timingSafeCompare(cookieToken, headerToken)) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed. Please refresh and try again.",
    });
  }

  return next();
};

module.exports = {
  csrfProtection,
  issueCsrfToken,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
};
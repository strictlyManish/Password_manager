const crypto = require("crypto");

const CSRF_COOKIE_NAME = "_csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET || "dev-csrf-secret-change-me";

const createTokenSignature = (token) =>
  crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");

const issueCsrfToken = (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  const signedToken = `${token}.${createTokenSignature(token)}`;

  res.cookie(CSRF_COOKIE_NAME, signedToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  req.csrfToken = () => token;
  return token;
};

const csrfProtection = (req, res, next) => {
  const method = req.method?.toUpperCase() || "GET";

  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    issueCsrfToken(req, res);
    return next();
  }

  const cookieValue = req.cookies?.[CSRF_COOKIE_NAME];
  const headerValue = req.headers[CSRF_HEADER_NAME];

  if (!cookieValue || !headerValue) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed. Please refresh and try again.",
    });
  }

  const [cookieToken, cookieSignature] = String(cookieValue).split(".");
  const headerToken = String(headerValue).trim();

  if (!cookieToken || !headerToken || !cookieSignature) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed. Please refresh and try again.",
    });
  }

  const expectedCookieSignature = createTokenSignature(cookieToken);
  const cookieMatches =
    cookieToken === headerToken &&
    crypto.timingSafeEqual(
      Buffer.from(cookieSignature),
      Buffer.from(expectedCookieSignature)
    );

  if (!cookieMatches) {
    return res.status(403).json({
      success: false,
      message: "CSRF validation failed. Please refresh and try again.",
    });
  }

  return next();
};

module.exports = { csrfProtection, issueCsrfToken, CSRF_COOKIE_NAME, CSRF_HEADER_NAME };

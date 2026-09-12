import { PALETTE } from "../constants/theme";

const LOWER_SET = "abcdefghijklmnopqrstuvwxyz";
const UPPER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_SET = "0123456789";
const SYMBOL_SET = "!@#$%^&*()-_=+[]{};:,.<>?/~";

export function randomInt(max) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export function forgePassword(length, flags) {
  let pool = "";
  const requiredSets = [];
  if (flags.lower) { pool += LOWER_SET; requiredSets.push(LOWER_SET); }
  if (flags.upper) { pool += UPPER_SET; requiredSets.push(UPPER_SET); }
  if (flags.digits) { pool += DIGIT_SET; requiredSets.push(DIGIT_SET); }
  if (flags.symbols) { pool += SYMBOL_SET; requiredSets.push(SYMBOL_SET); }
  if (!pool) pool = LOWER_SET;

  const out = [];
  requiredSets.forEach((set) => {
    if (out.length < length) out.push(set[randomInt(set.length)]);
  });
  while (out.length < length) out.push(pool[randomInt(pool.length)]);
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out.join("");
}

export function scorePassword(pwd) {
  let poolSize = 0;
  if (/[a-z]/.test(pwd)) poolSize += 26;
  if (/[A-Z]/.test(pwd)) poolSize += 26;
  if (/[0-9]/.test(pwd)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) poolSize += 25;
  const entropy = pwd.length * Math.log2(Math.max(poolSize, 2));
  const blocks = Math.max(1, Math.min(10, Math.round(entropy / 14)));
  let label = "WEAK", color = PALETTE.coral;
  if (entropy >= 90) { label = "ELITE"; color = PALETTE.lime; }
  else if (entropy >= 65) { label = "STRONG"; color = PALETTE.lime; }
  else if (entropy >= 42) { label = "FAIR"; color = "#E8B84B"; }
  return { blocks, label, color, entropy: Math.round(entropy) };
}

export function charClass(ch) {
  if (/[0-9]/.test(ch)) return PALETTE.lime;
  if (/[^a-zA-Z0-9]/.test(ch)) return PALETTE.coral;
  return PALETTE.ink;
}
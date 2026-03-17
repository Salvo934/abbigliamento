#!/usr/bin/env node
/**
 * Libera le porte 3000 e 3001 (usate da Vite e API locale).
 * Su Windows non fa nulla. Uso: node scripts/kill-ports.js
 */
import { execSync } from "child_process";

const ports = [3000, 3001];
const isWin = process.platform === "win32";
if (isWin) process.exit(0);

for (const port of ports) {
  try {
    const pids = execSync(`lsof -ti :${port}`, { encoding: "utf8" }).trim();
    if (pids) {
      execSync(`kill -9 ${pids}`, { stdio: "inherit" });
      console.log(`[kill-ports] Porta ${port} liberata`);
    }
  } catch {
    // Nessun processo sulla porta
  }
}

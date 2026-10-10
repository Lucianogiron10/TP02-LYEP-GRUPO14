import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

test("sin MONGODB_URI el servidor falla antes de escuchar, incluso desde la raiz", () => {
  const resultado = spawnSync(process.execPath, ["server/index.js"], {
    cwd: repoRoot,
    env: { ...process.env, MONGODB_URI: "", PORT: "3001" },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(resultado.error, undefined);
  assert.equal(resultado.status, 1);
  assert.match(resultado.stderr, /Falta definir MONGODB_URI/);
  assert.doesNotMatch(resultado.stdout, /API de clientes disponible/);
});

test("rechaza un puerto invalido antes de conectar a MongoDB", () => {
  const resultado = spawnSync(process.execPath, ["server/src/index.js"], {
    cwd: repoRoot,
    env: { ...process.env, MONGODB_URI: "", PORT: "no-es-un-puerto" },
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(resultado.error, undefined);
  assert.equal(resultado.status, 1);
  assert.match(resultado.stderr, /PORT debe ser/);
});

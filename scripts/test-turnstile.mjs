import test from "node:test";
import assert from "node:assert/strict";
import { cancelTurnstile, getTurnstileToken } from "../navigator.js";

function fixture(t) {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const previous = globalThis.window;
  let callbacks;
  const removed = [];
  const container = { dataset: {}, replaceChildren() {} };
  globalThis.window = { turnstile: {
    render(_container, options) { callbacks = options; return "test-widget"; },
    remove(id) { removed.push(id); },
  } };
  t.after(() => { globalThis.window = previous; t.mock.timers.reset(); });
  return { container, removed, options: () => callbacks };
}

test("allows a human challenge to complete after the previous ten-second cutoff", async (t) => {
  const f = fixture(t);
  let settled = false;
  const pending = getTurnstileToken(f.container, "public-test-sitekey", "navigate");
  pending.then(() => { settled = true; }, () => { settled = true; });
  await Promise.resolve();
  t.mock.timers.tick(15000);
  await Promise.resolve();
  assert.equal(settled, false);
  f.options().callback("test-token");
  assert.equal(await pending, "test-token");
  assert.equal(f.options().action, "navigate");
});

test("timeout removes the obsolete widget and ignores late callbacks", async (t) => {
  const f = fixture(t);
  const pending = getTurnstileToken(f.container, "public-test-sitekey", "fit");
  const rejected = assert.rejects(pending, /turnstile_timeout/);
  await Promise.resolve();
  t.mock.timers.tick(45001);
  await rejected;
  assert.deepEqual(f.removed, ["test-widget"]);
  assert.equal(f.container.dataset.widgetId, undefined);
  f.options().callback("late-token");
  assert.equal(f.container.dataset.widgetId, undefined);
});

test("failed or expired verification releases the widget for a fresh attempt", async (t) => {
  const f = fixture(t);
  for (const callback of ["error-callback", "expired-callback"]) {
    const pending = getTurnstileToken(f.container, "public-test-sitekey");
    const rejected = assert.rejects(pending, /turnstile_failed|turnstile_expired/);
    await Promise.resolve();
    f.options()[callback]();
    await rejected;
    assert.equal(f.container.dataset.widgetId, undefined);
  }
  assert.equal(f.removed.length, 2);
});

test("a superseded challenge cannot clear the newer widget or resolve it", async (t) => {
  const f = fixture(t);
  const options = [];
  globalThis.window.turnstile.render = (_container, value) => {
    options.push(value);
    return `widget-${options.length}`;
  };
  const first = getTurnstileToken(f.container, "public-test-sitekey");
  const rejected = assert.rejects(first, /turnstile_cancelled/);
  await Promise.resolve();
  const second = getTurnstileToken(f.container, "public-test-sitekey");
  await rejected;
  await Promise.resolve();
  options[0]["error-callback"]();
  options[0].callback("obsolete");
  assert.equal(f.container.dataset.widgetId, "widget-2");
  assert.deepEqual(f.removed, ["widget-1"]);
  options[1].callback("fresh-token");
  assert.equal(await second, "fresh-token");
  t.mock.timers.tick(45001);
  assert.deepEqual(f.removed, ["widget-1", "widget-2"]);
});

test("closing a guide cancels its challenge immediately", async (t) => {
  const f = fixture(t);
  const pending = getTurnstileToken(f.container, "public-test-sitekey");
  const rejected = assert.rejects(pending, /turnstile_cancelled/);
  await Promise.resolve();
  cancelTurnstile(f.container);
  await rejected;
  assert.equal(f.container.dataset.widgetId, undefined);
  t.mock.timers.tick(45001);
  assert.deepEqual(f.removed, ["test-widget"]);
});

test("synchronous verification callbacks release their widget and timer", async (t) => {
  const f = fixture(t);
  globalThis.window.turnstile.render = (_container, options) => {
    options.callback("synchronous-token");
    return "sync-widget";
  };
  assert.equal(await getTurnstileToken(f.container, "public-test-sitekey"), "synchronous-token");
  assert.equal(f.container.dataset.widgetId, undefined);
  assert.deepEqual(f.removed, ["sync-widget"]);
  t.mock.timers.tick(45001);
  assert.deepEqual(f.removed, ["sync-widget"]);
});

test("cancellation before the script loads does not create a stale widget", async (t) => {
  const f = fixture(t);
  const previousDocument = globalThis.document;
  const api = globalThis.window.turnstile;
  const handlers = {};
  delete globalThis.window.turnstile;
  globalThis.document = {
    createElement: () => ({ addEventListener: (name, callback) => { handlers[name] = callback; } }),
    head: { append() {} },
  };
  t.after(() => { globalThis.document = previousDocument; });
  const pending = getTurnstileToken(f.container, "public-test-sitekey");
  const rejected = assert.rejects(pending, /turnstile_cancelled/);
  cancelTurnstile(f.container);
  await rejected;
  globalThis.window.turnstile = api;
  handlers.load();
  await Promise.resolve();
  assert.equal(f.options(), undefined);
  assert.equal(f.container.dataset.widgetId, undefined);
});

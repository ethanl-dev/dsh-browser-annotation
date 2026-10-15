/**
 * Static verification for the browser annotation bundle.
 * 1. The client bundle registers a mountable plugin with the right id/inject.
 * 2. plugin.apply() completes with mocked slots/locale, and each registered
 *    component renders once without throwing.
 * 3. The guest picker script (pickerMain) runs its ready/exit lifecycle
 *    against a minimal DOM stub.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const registered = [];
global.window = {
  __ModuleLoader__: {
    load(entry) {
      registered.push(entry);
    },
  },
};

const source = readFileSync(join(__dirname, 'client.js'), 'utf8');
new Function(source)();

if (registered.length !== 1) {
  console.error(`FAIL: expected 1 bundle registration, got ${registered.length}`);
  process.exit(1);
}
const entry = registered[0];
if (entry.id !== '@local/dsh-browser-annotation') {
  console.error(`FAIL: unexpected bundle id ${entry.id}`);
  process.exit(1);
}

// ---- React stub: enough for our components to render once ----
const React = {
  useState(v) { return [typeof v === 'function' ? v() : v, () => {}]; },
  useEffect() {},
  useRef(v) { return { current: v ?? null }; },
  useContext(ctx) { return ctx && typeof ctx === 'object' && 'value' in ctx ? ctx.value : (k) => k; },
  useSyncExternalStore(subscribe, getSnapshot) { return getSnapshot(); },
  useMemo(fn) { return fn(); },
  createContext(defaultValue) { return { value: defaultValue }; },
  createElement() { return null; },
};

const plugin = entry.factory((name) => {
  if (name === 'react') return React;
  throw new Error(`unexpected require: ${name}`);
});

if (!plugin || typeof plugin.apply !== 'function') {
  console.error('FAIL: factory did not return a plugin with apply()');
  process.exit(1);
}
if (!Array.isArray(plugin.inject) || !plugin.inject.includes('slots')) {
  console.error('FAIL: plugin.inject missing required services');
  process.exit(1);
}

// ---- mock host ctx: capture slot registrations ----
const slotRegistrations = [];
const localeRegistrations = [];
const sourceRegistrations = [];
const chipSource = { registerSource(src) { sourceRegistrations.push(src); return () => {}; } };
const ctx = {
  effect(fn) { fn(); },
  get(name) {
    if (name === 'sessions') return { binding: () => undefined, scope: () => undefined };
    if (name === 'inputTriggers') return chipSource;
    return undefined;
  },
  inputTriggers: chipSource,
  locale: {
    register(ns, dicts) { localeRegistrations.push({ ns, dicts }); },
    bind() { return (k) => k; },
  },
  slots: {
    inject(_owner, fn) { fn(); },
    register(options, component) {
      slotRegistrations.push({ options, component });
    },
  },
};

plugin.apply(ctx);

const expectedSlots = ['conversation.composer.dock', 'shell.overlay'];
for (const name of expectedSlots) {
  if (!slotRegistrations.some((r) => r.options.name === name)) {
    console.error(`FAIL: no registration for slot ${name}`);
    process.exit(1);
  }
}

// The annotation chip source must be registered with a codec so inserted
// chips serialize at submit time instead of blocking the send.
const annoSource = sourceRegistrations.find((s) => s.name === 'page-annotation');
if (!annoSource) {
  console.error('FAIL: page-annotation chip source not registered');
  process.exit(1);
}
if (typeof annoSource.codec?.serialize !== 'function') {
  console.error('FAIL: chip source has no codec.serialize');
  process.exit(1);
}
const sampleItem = { n: 1, kind: 'element', selector: 'div.card', width: 376, height: 130, docX: 8, docY: 80, color: 'rgb(0,0,0)', fontSize: '16px', fontFamily: '-apple-system', text: 'hi', comment: '对齐有问题' };
// With no thumbnails attached (lastSendHadImages=false in this harness),
// serialize falls back to the full annotation text so details are never lost.
const serialized = await annoSource.codec.serialize(JSON.stringify(sampleItem));
if (typeof serialized !== 'string' || !serialized.includes('div.card') || !serialized.includes('对齐有问题')) {
  console.error('FAIL: codec.serialize fallback produced unexpected output:', serialized);
  process.exit(1);
}
const clip = annoSource.codec.clipboardText(JSON.stringify(sampleItem));
if (!clip.includes('批注1') || !clip.includes('对齐有问题')) {
  console.error('FAIL: codec.clipboardText produced unexpected output:', clip);
  process.exit(1);
}
// Aggregate payload (the current send path): { url, items }.
const aggregate = { url: 'https://example.com/', items: [sampleItem] };
const serializedAgg = await annoSource.codec.serialize(JSON.stringify(aggregate));
if (!serializedAgg.includes('【页面批注】https://example.com/') || !serializedAgg.includes('div.card') || !serializedAgg.includes('对齐有问题')) {
  console.error('FAIL: aggregate fallback serialize produced unexpected output:', serializedAgg);
  process.exit(1);
}
const clipAgg = annoSource.codec.clipboardText(JSON.stringify(aggregate));
if (!clipAgg.includes('1 条注释') || !clipAgg.includes('example.com')) {
  console.error('FAIL: aggregate clipboardText produced unexpected output:', clipAgg);
  process.exit(1);
}
console.log('PASS: chip source codec serializes annotation items');

// Render each registered component once; components that return null are fine.
for (const { options, component } of slotRegistrations) {
  try {
    component({ useInput: () => '', inputActions: null });
  } catch (error) {
    console.error(`FAIL: component for ${options.name} threw on render:`, error.message);
    process.exit(1);
  }
}

if (localeRegistrations.length !== 1 || !localeRegistrations[0].dicts.zh || !localeRegistrations[0].dicts.en) {
  console.error('FAIL: locale dictionaries not registered');
  process.exit(1);
}
console.log('PASS: plugin apply() registers slots and components render');

// ---- guest picker lifecycle against a DOM stub ----
const pickerSourceMatch = source.match(/function pickerMain\(\) \{/);
if (!pickerSourceMatch) {
  console.error('FAIL: pickerMain not found in client.js');
  process.exit(1);
}

// Extract pickerMain by brace counting from its start.
const startIdx = source.indexOf('function pickerMain() {');
let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < source.length; i++) {
  const ch = source[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) { endIdx = i + 1; break; }
  }
}
if (endIdx === -1) {
  console.error('FAIL: could not extract pickerMain source');
  process.exit(1);
}
const pickerSource = source.slice(startIdx, endIdx);

function makeStubElement() {
  const el = {
    children: [],
    style: { cssText: '' },
    dataset: {},
    classList: [],
    appendChild(c) { this.children.push(c); return c; },
    remove() {},
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    focus() {},
    closest() { return null; },
  };
  return el;
}
const docStub = {
  createElement: () => makeStubElement(),
  createElementNS: () => makeStubElement(),
  documentElement: makeStubElement(),
  body: makeStubElement(),
  addEventListener() {},
  removeEventListener() {},
  elementFromPoint: () => null,
};

const logs = [];
const guestWindow = {
  __dshAnnoRunning: false,
  addEventListener() {},
  removeEventListener() {},
  scrollX: 0,
  scrollY: 0,
  innerWidth: 800,
  innerHeight: 600,
  devicePixelRatio: 2,
};
const guestConsole = { log: (msg) => logs.push(msg) };

const runPicker = new Function('window', 'document', 'console', 'location', `${pickerSource}; return pickerMain();`);
const ok = runPicker.call(guestWindow, guestWindow, docStub, guestConsole, { href: 'http://test.local/' });

if (ok !== true) {
  console.error('FAIL: pickerMain did not return true on first injection');
  process.exit(1);
}
if (!logs.some((m) => typeof m === 'string' && m.startsWith('__DSH_ANNO__') && m.includes('"ready"'))) {
  console.error('FAIL: picker did not announce ready');
  process.exit(1);
}
if (typeof guestWindow.__dshAnnoExit !== 'function') {
  console.error('FAIL: picker did not install __dshAnnoExit');
  process.exit(1);
}
// Screenshot helpers must be installed by the picker.
for (const cmd of ['__dshAnnoChrome', '__dshAnnoRects', '__dshAnnoClear', '__dshAnnoFlash', '__dshAnnoTogglePins']) {
  if (typeof guestWindow[cmd] !== 'function') {
    console.error(`FAIL: picker did not install ${cmd}`);
    process.exit(1);
  }
}
const rectsInfo = guestWindow.__dshAnnoRects();
if (!rectsInfo || !Array.isArray(rectsInfo.rects)) {
  console.error('FAIL: __dshAnnoRects did not return a rects array');
  process.exit(1);
}
guestWindow.__dshAnnoChrome(false);
guestWindow.__dshAnnoChrome(true);
logs.length = 0;
guestWindow.__dshAnnoExit();
if (!logs.some((m) => typeof m === 'string' && m.includes('"exit"'))) {
  console.error('FAIL: picker exit did not announce exit');
  process.exit(1);
}
// Commands are uninstalled on exit.
if (guestWindow.__dshAnnoRects !== null) {
  console.error('FAIL: __dshAnnoRects not cleaned up on exit');
  process.exit(1);
}
console.log('PASS: guest picker ready/exit lifecycle works');

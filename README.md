# Browser Annotation Plugin for DeepSeek Harness

A DSH client plugin that reproduces Codex-style page annotation (元素批注) on the desktop browser sidebar.

## What it does

- A floating inspector button (lucide `square-dashed-mouse-pointer` icon, no emoji) sits at the top-right corner of the browser viewport whenever a browser tab is visible.
- Clicking it injects a picker script into the page (`webview.executeJavaScript`):
  - **Hover** highlights the element under the cursor with a blue outline + corner nub, and a dark inspector tooltip (selector / size / color / font).
  - **Click** pins the element (persistent blue outline while editing) and opens a white pill comment box (sliders icon + input + ✓).
  - **Drag** selects a rectangular region and opens the same comment box.
  - Each submitted comment drops a **numbered blue badge** (chat-bubble shape) pinned to the element in document coordinates — it follows scroll.
  - **Hold Space** to temporarily interact with the page; **Esc** exits.
- A Codex-style dark bottom bar shows「正在批注 · N」with lucide-icon actions: **locate** (flash pinned elements), **hide/show badges**, **copy**, **clear**, plus **发送** and **✕**.
- **发送** produces the Codex look — captioned thumbnail cards only:
  1. The webview is captured (`webview.capturePage()`, fixed chrome hidden, badges kept) and **each pin is cropped into its own thumbnail** with a dark caption strip baked in (`N. selector/区域 —— 评论`; the first card also carries a URL line), so the vision model reads every annotation straight from the image — no file card, no text dump.
  2. **One aggregate reference chip「N 条注释」** sits in the draft as the capsule; at submit time `codec.serialize` contributes **no wire text** when thumbnails attached — a message with no typed body shows cards only, no bubble. If capture failed, serialization falls back to the full text so details are never lost.
  3. Fallbacks: no capturePage/conversation service → chip only (text fallback); no session scope → plain-text draft; no composer bridge → clipboard.
- All icons are inlined lucide SVG paths; the plugin has no runtime dependency on icon packages.

## Architecture

- Host (DSH page): floating entry, bottom bar, composer bridge (`conversation.composer.dock` captures `inputActions`/`useInput`/`sessionId`), lifecycle management.
- Guest (webview page): self-contained picker injected as a stringified function; talks back through `console-message` events with a `__DSH_ANNO__` JSON prefix.
- Deactivated automatically on page navigation (`did-start-loading`).
- Chip insertion: `sessions.binding(sessionId).ctx.bail('slash/input-insert-reference', { reference, span })` with the span from `inputActions.captureInsertion()`. The `page-annotation` source's `codec.serialize` returns empty wire text when thumbnails were attached (cards carry everything) and falls back to the full composed text otherwise; `codec.clipboardText` supplies the draft-persistence/clipboard form.
- Thumbnails: guest `__dshAnnoRects()` reports current viewport rects (elements re-measured live, regions adjusted by scroll); the host crops the capture per pin with 48 CSS px padding, bakes a dark caption strip (number + selector/region + comment; URL on the first card) into the image, and registers each crop via `conversation.createDrafts(sessionId, files)`.

## Install / update

Install into the desktop profile with the `dsh` CLI (requires pnpm on PATH):

```sh
# from a local checkout
dsh plugin --profile desktop add ./dsh-browser-annotation

# or straight from GitHub
dsh plugin --profile desktop add github:ethanl-dev/dsh-browser-annotation
```

The bundle is registered in the active desktop profile (symlinked from the
profile's `node_modules`). Restart DeepSeek Harness Desktop after changes.

`demo.html` is a test target page: serve it (`python3 -m http.server 8765`) and open `http://127.0.0.1:8765/demo.html` in the DSH browser sidebar to try annotation.

## Limitations

- Desktop only: the Web profile's iframe fallback cannot be injected (`executeJavaScript` is a webview-only API); the button shows a short「仅桌面端可用」notice there.
- Pages with a strict CSP that forbids `eval`-style script execution may refuse the injected picker.
- Badges are positioned in document coordinates; heavy layout reflows after pinning can drift them.

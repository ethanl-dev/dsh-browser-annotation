window.__ModuleLoader__.load({
  id: '@local/dsh-browser-annotation',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NAMESPACE = 'browserAnnotation';
    const PREFIX = '__DSH_ANNO__';
    const BLUE = '#3574F0';

    const en = {
      'toggle.tip': 'Point at page elements to ask or request changes',
      'bar.count': 'Annotating',
      'bar.send': 'Send',
      'bar.locate': 'Flash pinned elements',
      'bar.hide': 'Hide badges',
      'bar.show': 'Show badges',
      'bar.copy': 'Copy annotations',
      'bar.clear': 'Clear all',
      'bar.close': 'Exit annotation',
      'unsupported': 'Annotation is only available in the desktop browser',
      'notice.injectFailed': 'Annotation script failed to inject — reload the page and try again',
    };
    const zh = {
      'toggle.tip': '指向网页元素以提问或请求修改',
      'bar.count': '正在批注',
      'bar.send': '发送',
      'bar.locate': '定位已批注元素',
      'bar.hide': '隐藏批注标记',
      'bar.show': '显示批注标记',
      'bar.copy': '复制批注内容',
      'bar.clear': '清空批注',
      'bar.close': '退出批注',
      'unsupported': '批注功能仅支持桌面端内置浏览器',
      'notice.injectFailed': '批注脚本注入失败，请刷新页面后重试',
    };

    // ---- lucide icons (inlined path data, 24x24 viewBox, stroke style) ----
    const ICONS = {
      inspect: [
        ['path', { d: 'M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z' }],
        ['path', { d: 'M5 3a2 2 0 0 0-2 2' }],
        ['path', { d: 'M19 3a2 2 0 0 1 2 2' }],
        ['path', { d: 'M5 21a2 2 0 0 1-2-2' }],
        ['path', { d: 'M9 3h1' }],
        ['path', { d: 'M9 21h2' }],
        ['path', { d: 'M14 3h1' }],
        ['path', { d: 'M3 9v1' }],
        ['path', { d: 'M21 9v2' }],
        ['path', { d: 'M3 14v1' }],
      ],
      gripVertical: [
        ['circle', { cx: 9, cy: 5, r: 1 }],
        ['circle', { cx: 9, cy: 12, r: 1 }],
        ['circle', { cx: 9, cy: 19, r: 1 }],
        ['circle', { cx: 15, cy: 5, r: 1 }],
        ['circle', { cx: 15, cy: 12, r: 1 }],
        ['circle', { cx: 15, cy: 19, r: 1 }],
      ],
      locate: [
        ['line', { x1: 2, x2: 5, y1: 12, y2: 12 }],
        ['line', { x1: 19, x2: 22, y1: 12, y2: 12 }],
        ['line', { x1: 12, x2: 12, y1: 2, y2: 5 }],
        ['line', { x1: 12, x2: 12, y1: 19, y2: 22 }],
        ['circle', { cx: 12, cy: 12, r: 7 }],
        ['circle', { cx: 12, cy: 12, r: 1 }],
      ],
      eyeOff: [
        ['path', { d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49' }],
        ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242' }],
        ['path', { d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143' }],
        ['path', { d: 'm2 2 20 20' }],
      ],
      eye: [
        ['path', { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' }],
        ['circle', { cx: 12, cy: 12, r: 3 }],
      ],
      copy: [
        ['rect', { width: 14, height: 14, x: 8, y: 8, rx: 2, ry: 2 }],
        ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }],
      ],
      trash: [
        ['path', { d: 'M3 6h18' }],
        ['path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' }],
        ['path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' }],
        ['line', { x1: 10, x2: 10, y1: 11, y2: 17 }],
        ['line', { x1: 14, x2: 14, y1: 11, y2: 17 }],
      ],
      x: [
        ['path', { d: 'M18 6 6 18' }],
        ['path', { d: 'm6 6 12 12' }],
      ],
    };

    function Icon({ name, size = 16, strokeWidth = 2 }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
        style: { display: 'block', flex: 'none' },
      }, ICONS[name].map(([tag, attrs], i) => h(tag, { key: i, ...attrs })));
    }

    // ---- shared reactive store ----
    function createGlobalStore(initial) {
      let state = initial;
      const listeners = new Set();
      return {
        getSnapshot() { return state; },
        set(patch) {
          state = { ...state, ...patch };
          listeners.forEach((fn) => fn());
        },
        subscribe(fn) {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
      };
    }
    const anno = createGlobalStore({
      active: false,
      items: [],
      url: '',
      unsupported: false,
      pinsHidden: false,
      notice: null,
      sending: false,
    });

    function showNotice(key) {
      anno.set({ notice: key });
      setTimeout(() => { if (anno.getSnapshot().notice === key) anno.set({ notice: null }); }, 3400);
    }

    // Composer bridge: a hidden entry in conversation.composer.dock captures
    // inputActions + the live draft + sessionId so the bottom bar can insert
    // annotation chips into the composer.
    const bridge = { sessionId: null, inputActions: null, draft: '' };
    const hostServices = { sessions: null, sidebarRight: null, ctx: null };
    // Set at send time: whether captioned thumbnails were attached. The chip
    // codec reads it to decide between empty wire text (images carry the
    // details) and full text fallback (capture failed / images removed).
    let lastSendHadImages = false;

    // Lazy service resolution: services may register after this plugin's
    // apply() ran, so read them at call time instead of capturing once.
    function conversationService() {
      try { return hostServices.ctx && hostServices.ctx.get('conversation') || null; } catch (_) { return null; }
    }

    // ---- webview discovery ----
    function isVisible(el) {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) return false;
      if (r.bottom < 0 || r.right < 0 || r.top > window.innerHeight || r.left > window.innerWidth) return false;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
      return true;
    }

    function findWebview() {
      const candidates = [...document.querySelectorAll('[data-sidebar-browser-frame="webview"]')];
      const visible = candidates.filter(isVisible);
      return visible.find((el) => el.closest('[data-dockkit-pane-active], [data-dockkit-float-active]') !== null) || visible[0] || null;
    }

    function useViewport() {
      const [rect, setRect] = React.useState(null);
      React.useEffect(() => {
        const update = () => {
          const chosen = findWebview();
          if (!chosen) { setRect(null); return; }
          const r = chosen.getBoundingClientRect();
          setRect((prev) => (prev && prev.left === r.left && prev.top === r.top && prev.width === r.width && prev.height === r.height)
            ? prev
            : { left: r.left, top: r.top, width: r.width, height: r.height });
        };
        update();
        const id = setInterval(update, 200);
        window.addEventListener('resize', update);
        return () => { clearInterval(id); window.removeEventListener('resize', update); };
      }, []);
      return rect;
    }

    // ---- guest page picker (stringified and injected via executeJavaScript) ----
    // Self-contained: no closure references. Talks back via
    // console.log(PREFIX + JSON.stringify(payload)).
    function pickerMain() {
      if (window.__dshAnnoRunning) return false;
      window.__dshAnnoRunning = true;
      const PREFIX = '__DSH_ANNO__';
      const BLUE = '#3574F0';
      const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
      const SANS = '-apple-system, system-ui, sans-serif';
      const send = (obj) => { try { console.log(PREFIX + JSON.stringify(obj)); } catch (_) {} };

      const SVG_SLIDERS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a8f99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>';
      const SVG_CHECK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

      const docLayer = document.createElement('div');
      docLayer.id = '__dsh-anno-doc';
      docLayer.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;z-index:2147483646;pointer-events:none;';
      const fixedLayer = document.createElement('div');
      fixedLayer.id = '__dsh-anno-fixed';
      fixedLayer.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;font-family:' + SANS + ';';
      document.documentElement.appendChild(docLayer);
      document.documentElement.appendChild(fixedLayer);

      // hint banner: two lines with kbd-styled space key
      const hint = document.createElement('div');
      hint.style.cssText = 'position:fixed;top:14px;left:14px;background:#1f1f1f;color:#fff;font:13px/1.9 ' + SANS + ';padding:10px 16px;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,0.28);';
      hint.innerHTML = '点击任意位置即可添加批注，也可拖动选取区域。<br>按住 <span style="display:inline-block;border:0.5px solid rgba(255,255,255,0.45);border-radius:4px;padding:0 6px;margin:0 2px;font-size:12px;line-height:18px;">空格键</span> 时可暂时操作网页。';
      fixedLayer.appendChild(hint);

      // hover outline + corner nub + inspector tooltip
      const outline = document.createElement('div');
      outline.style.cssText = 'position:fixed;display:none;border:1.5px solid ' + BLUE + ';border-radius:3px;pointer-events:none;';
      fixedLayer.appendChild(outline);
      const nub = document.createElement('div');
      nub.style.cssText = 'position:fixed;display:none;width:14px;height:14px;background:' + BLUE + ';border-radius:4px 4px 4px 0;pointer-events:none;';
      fixedLayer.appendChild(nub);

      const tip = document.createElement('div');
      tip.style.cssText = 'position:fixed;display:none;background:#1f1f1f;color:#fff;font:12px/1.8 ' + SANS + ';padding:10px 14px;border-radius:10px;pointer-events:none;box-shadow:0 6px 24px rgba(0,0,0,0.28);min-width:190px;';
      fixedLayer.appendChild(tip);

      const dragRect = document.createElement('div');
      dragRect.style.cssText = 'position:fixed;display:none;border:1.5px dashed ' + BLUE + ';background:rgba(53,116,240,0.06);border-radius:3px;pointer-events:none;';
      fixedLayer.appendChild(dragRect);

      let passthrough = false;
      let hoverEl = null;
      let dragStart = null;
      let dragging = false;
      let commentBox = null;
      let pinOutline = null;
      let badgeN = 0;
      const pins = [];

      function describe(el) {
        const r = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        let selector = el.tagName.toLowerCase();
        if (el.id) selector += '#' + el.id;
        else if (el.classList.length) selector += '.' + [...el.classList].slice(0, 2).join('.');
        return {
          tag: el.tagName.toLowerCase(),
          selector,
          width: Math.round(r.width),
          height: Math.round(r.height),
          color: cs.color,
          fontSize: cs.fontSize,
          fontFamily: cs.fontFamily.split(',')[0],
          text: (el.innerText || '').trim().slice(0, 60),
          docX: Math.round(r.left + window.scrollX),
          docY: Math.round(r.top + window.scrollY),
        };
      }

      function showHover(el) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) { hideHover(); return; }
        outline.style.display = 'block';
        outline.style.left = r.left + 'px';
        outline.style.top = r.top + 'px';
        outline.style.width = r.width + 'px';
        outline.style.height = r.height + 'px';
        nub.style.display = 'block';
        nub.style.left = (r.left - 2) + 'px';
        nub.style.top = (r.top - 2) + 'px';
        const d = describe(el);
        tip.style.display = 'block';
        tip.innerHTML =
          '<div style="display:flex;justify-content:space-between;gap:16px;"><span style="font-family:' + MONO + ';">' + d.selector + '</span><span style="font-family:' + MONO + ';color:rgba(255,255,255,0.85);">' + d.width + 'x' + d.height + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;gap:16px;"><span style="color:rgba(255,255,255,0.55);">颜色</span><span style="font-family:' + MONO + ';font-size:11px;">' + d.color + '</span></div>' +
          '<div style="display:flex;justify-content:space-between;gap:16px;"><span style="color:rgba(255,255,255,0.55);">字体</span><span style="font-family:' + MONO + ';font-size:11px;max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + d.fontSize + '  ' + d.fontFamily + '</span></div>';
        const tw = 230;
        const tipX = Math.max(8, Math.min(r.left, window.innerWidth - tw - 8));
        const tipY = r.top - 100 > 8 ? r.top - 100 : r.bottom + 10;
        tip.style.left = tipX + 'px';
        tip.style.top = tipY + 'px';
      }
      function hideHover() {
        outline.style.display = 'none';
        nub.style.display = 'none';
        tip.style.display = 'none';
      }

      function pick(x, y) {
        const el = document.elementFromPoint(x, y);
        if (!el || el === document.documentElement || el === document.body) return null;
        if (el.closest('#__dsh-anno-doc, #__dsh-anno-fixed')) return null;
        return el;
      }

      function addBadge(x, y, n) {
        const b = document.createElement('div');
        b.style.cssText = 'position:absolute;left:' + (x - 2) + 'px;top:' + (y - 2) + 'px;min-width:20px;height:20px;padding:0 5px;background:' + BLUE + ';color:#fff;font:600 12px/20px ' + SANS + ';text-align:center;border-radius:10px 10px 10px 2px;box-shadow:0 2px 8px rgba(0,0,0,0.28);';
        b.textContent = String(n);
        docLayer.appendChild(b);
        return b;
      }

      function showPinOutline(x, y, w, hgt) {
        hidePinOutline();
        pinOutline = document.createElement('div');
        pinOutline.style.cssText = 'position:absolute;left:' + (x - 1.5) + 'px;top:' + (y - 1.5) + 'px;width:' + (w + 3) + 'px;height:' + (hgt + 3) + 'px;border:1.5px solid ' + BLUE + ';border-radius:3px;background:rgba(53,116,240,0.05);';
        docLayer.appendChild(pinOutline);
      }
      function hidePinOutline() {
        if (pinOutline) { pinOutline.remove(); pinOutline = null; }
      }

      function openCommentBox(docX, docY, commit) {
        closeCommentBox();
        const box = document.createElement('div');
        box.style.cssText = 'position:absolute;left:' + docX + 'px;top:' + docY + 'px;pointer-events:auto;display:flex;align-items:center;gap:8px;background:#fff;border-radius:26px;padding:7px 8px 7px 14px;box-shadow:0 10px 34px rgba(0,0,0,0.22);width:400px;max-width:calc(100vw - 32px);font-family:' + SANS + ';';
        const iconWrap = document.createElement('span');
        iconWrap.style.cssText = 'display:inline-flex;flex:none;';
        iconWrap.innerHTML = SVG_SLIDERS;
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '添加评论…';
        input.style.cssText = 'flex:1;border:none;outline:none;font:14px/1.5 ' + SANS + ';color:#1f1f1f;background:transparent;min-width:0;';
        const ok = document.createElement('button');
        ok.type = 'button';
        ok.title = '完成';
        ok.style.cssText = 'width:32px;height:32px;border:none;border-radius:50%;background:#1f1f1f;cursor:pointer;flex:none;display:none;align-items:center;justify-content:center;';
        ok.innerHTML = SVG_CHECK;
        ok.style.display = 'inline-flex';
        box.appendChild(iconWrap);
        box.appendChild(input);
        box.appendChild(ok);
        docLayer.appendChild(box);
        commentBox = box;
        const submit = () => {
          const text = input.value.trim();
          closeCommentBox();
          if (text) commit(text);
        };
        ok.addEventListener('click', (e) => { e.stopPropagation(); submit(); });
        input.addEventListener('keydown', (e) => {
          e.stopPropagation();
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') closeCommentBox();
        });
        input.addEventListener('click', (e) => e.stopPropagation());
        setTimeout(() => input.focus(), 0);
      }
      function closeCommentBox() {
        if (commentBox) { commentBox.remove(); commentBox = null; }
        hidePinOutline();
      }

      function onMouseMove(e) {
        if (passthrough) return;
        if (e.target && e.target.closest && e.target.closest('#__dsh-anno-doc')) return;
        if (dragStart) {
          dragging = true;
          const x = Math.min(dragStart.x, e.clientX);
          const y = Math.min(dragStart.y, e.clientY);
          dragRect.style.display = 'block';
          dragRect.style.left = x + 'px';
          dragRect.style.top = y + 'px';
          dragRect.style.width = Math.abs(e.clientX - dragStart.x) + 'px';
          dragRect.style.height = Math.abs(e.clientY - dragStart.y) + 'px';
          return;
        }
        if (commentBox) { hideHover(); return; }
        const el = pick(e.clientX, e.clientY);
        hoverEl = el;
        if (el) showHover(el); else hideHover();
      }
      function onMouseDown(e) {
        if (passthrough || e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest('#__dsh-anno-doc')) return;
        dragStart = { x: e.clientX, y: e.clientY };
        dragging = false;
        e.preventDefault();
      }
      function onMouseUp(e) {
        if (passthrough || e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest('#__dsh-anno-doc')) { dragStart = null; dragging = false; return; }
        if (!dragStart) return;
        const start = dragStart;
        dragStart = null;
        dragRect.style.display = 'none';
        e.preventDefault();
        const dx = Math.abs(e.clientX - start.x);
        const dy = Math.abs(e.clientY - start.y);
        if (dragging && (dx > 4 || dy > 4)) {
          dragging = false;
          hideHover();
          const x = Math.min(start.x, e.clientX);
          const y = Math.min(start.y, e.clientY);
          const w = Math.max(dx, 1);
          const hh = Math.max(dy, 1);
          const docX = Math.round(x + window.scrollX);
          const docY = Math.round(y + window.scrollY);
          showPinOutline(docX, docY, w, hh);
          openCommentBox(Math.max(window.scrollX + 8, Math.min(docX, window.scrollX + window.innerWidth - 416)), docY + hh + 10, (text) => {
            badgeN += 1;
            const badgeEl = addBadge(docX, docY, badgeN);
            pins.push({ n: badgeN, kind: 'region', rect: { x: docX, y: docY, w, h: hh }, badgeEl });
            send({ type: 'comment', n: badgeN, kind: 'region', rect: { x: docX, y: docY, w: Math.round(w), h: Math.round(hh) }, comment: text, url: location.href });
          });
          return;
        }
        dragging = false;
        if (commentBox) return;
        const el = pick(e.clientX, e.clientY);
        if (!el) return;
        const d = describe(el);
        hideHover();
        showPinOutline(d.docX, d.docY, d.width, d.height);
        openCommentBox(Math.max(window.scrollX + 8, Math.min(d.docX, window.scrollX + window.innerWidth - 416)), d.docY + 28, (text) => {
          badgeN += 1;
          const badgeEl = addBadge(d.docX, d.docY, badgeN);
          pins.push({ n: badgeN, kind: 'element', el, badgeEl });
          send({ type: 'comment', n: badgeN, kind: 'element', selector: d.selector, tag: d.tag, width: d.width, height: d.height, color: d.color, fontSize: d.fontSize, fontFamily: d.fontFamily, text: d.text, docX: d.docX, docY: d.docY, comment: text, url: location.href });
        });
      }
      function onClickCapture(e) {
        if (passthrough) return;
        if (e.target && e.target.closest && e.target.closest('#__dsh-anno-doc, #__dsh-anno-fixed')) return;
        e.preventDefault();
        e.stopPropagation();
      }
      function onKeyDown(e) {
        if (e.target && e.target.closest && e.target.closest('#__dsh-anno-doc')) return;
        if (e.code === 'Space') {
          if (!passthrough) e.preventDefault();
          passthrough = true;
          hideHover();
          dragRect.style.display = 'none';
          dragStart = null;
          dragging = false;
        }
        if (e.key === 'Escape') exit();
      }
      function onKeyUp(e) {
        if (e.code === 'Space') passthrough = false;
      }

      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('mousedown', onMouseDown, true);
      document.addEventListener('mouseup', onMouseUp, true);
      document.addEventListener('click', onClickCapture, true);
      document.addEventListener('keydown', onKeyDown, true);
      document.addEventListener('keyup', onKeyUp, true);

      // host-invoked commands
      window.__dshAnnoClear = () => {
        pins.forEach((p) => p.badgeEl.remove());
        pins.length = 0;
        badgeN = 0;
        closeCommentBox();
      };
      window.__dshAnnoFlash = () => {
        pins.forEach((p) => {
          let r = null;
          if (p.kind === 'element' && p.el && p.el.isConnected) r = p.el.getBoundingClientRect();
          else if (p.kind === 'region') r = { left: p.rect.x - window.scrollX, top: p.rect.y - window.scrollY, width: p.rect.w, height: p.rect.h };
          if (!r) return;
          const f = document.createElement('div');
          f.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;border:1.5px solid ' + BLUE + ';border-radius:3px;background:rgba(53,116,240,0.12);transition:opacity 0.5s;';
          fixedLayer.appendChild(f);
          setTimeout(() => { f.style.opacity = '0'; }, 500);
          setTimeout(() => { f.remove(); }, 1100);
        });
      };
      window.__dshAnnoTogglePins = (hidden) => {
        docLayer.style.display = hidden ? 'none' : 'block';
      };
      // Screenshot support: hide the fixed chrome (hint/outline/tooltip) while
      // keeping the pinned badges, so captures look clean but still show markers.
      window.__dshAnnoChrome = (visible) => {
        fixedLayer.style.display = visible ? 'block' : 'none';
      };
      // Current viewport rects of every pin, in badge order, for cropping.
      window.__dshAnnoRects = () => {
        return {
          dpr: window.devicePixelRatio || 1,
          rects: pins.map((p) => {
            if (p.kind === 'element' && p.el && p.el.isConnected) {
              const r = p.el.getBoundingClientRect();
              return { n: p.n, x: r.left, y: r.top, w: r.width, h: r.height };
            }
            if (p.kind === 'region') return { n: p.n, x: p.rect.x - window.scrollX, y: p.rect.y - window.scrollY, w: p.rect.w, h: p.rect.h };
            return null;
          }).filter(Boolean),
        };
      };

      function exit() {
        document.removeEventListener('mousemove', onMouseMove, true);
        document.removeEventListener('mousedown', onMouseDown, true);
        document.removeEventListener('mouseup', onMouseUp, true);
        document.removeEventListener('click', onClickCapture, true);
        document.removeEventListener('keydown', onKeyDown, true);
        document.removeEventListener('keyup', onKeyUp, true);
        docLayer.remove();
        fixedLayer.remove();
        window.__dshAnnoRunning = false;
        window.__dshAnnoExit = null;
        window.__dshAnnoClear = null;
        window.__dshAnnoFlash = null;
        window.__dshAnnoTogglePins = null;
        window.__dshAnnoChrome = null;
        window.__dshAnnoRects = null;
        send({ type: 'exit' });
      }
      window.__dshAnnoExit = exit;
      send({ type: 'ready' });
      return true;
    }

    // ---- activation lifecycle ----
    const session = { webview: null, detach: [], ready: false, readyTimer: null, attempts: 0 };

    function guestCall(source) {
      const wv = session.webview;
      if (!wv) return;
      try { wv.executeJavaScript(source, true).catch(() => {}); } catch (_) {}
    }

    function deactivate() {
      guestCall('window.__dshAnnoExit && window.__dshAnnoExit()');
      session.detach.forEach((fn) => { try { fn(); } catch (_) {} });
      session.detach = [];
      session.webview = null;
      if (session.readyTimer) { clearTimeout(session.readyTimer); session.readyTimer = null; }
      session.ready = false;
      session.attempts = 0;
      anno.set({ active: false, items: [], url: '', pinsHidden: false });
    }

    function injectPicker(wv) {
      console.info('[browser-annotation] injecting picker (attempt ' + (session.attempts + 1) + ')');
      session.attempts += 1;
      try {
        wv.executeJavaScript('(' + pickerMain.toString() + ')()', true).then((ok) => {
          console.info('[browser-annotation] inject resolved: ' + ok);
        }).catch((error) => {
          console.error('[browser-annotation] inject failed:', error);
          if (anno.getSnapshot().active) {
            showNotice('notice.injectFailed');
            deactivate();
          }
        });
      } catch (error) {
        console.error('[browser-annotation] inject failed:', error);
        if (anno.getSnapshot().active) {
          showNotice('notice.injectFailed');
          deactivate();
        }
      }
    }

    // The picker must answer 'ready' through console-message shortly after
    // injection; silence means the script never ran (CSP, stale context) —
    // retry once, then surface a visible notice instead of failing quietly.
    function armReadyWatchdog(wv) {
      if (session.readyTimer) clearTimeout(session.readyTimer);
      session.readyTimer = setTimeout(() => {
        session.readyTimer = null;
        if (!anno.getSnapshot().active || session.ready) return;
        if (session.attempts < 2) {
          console.warn('[browser-annotation] no ready from guest; retrying injection');
          injectPicker(wv);
          armReadyWatchdog(wv);
        } else {
          console.error('[browser-annotation] guest picker did not respond after retry');
          showNotice('notice.injectFailed');
          deactivate();
        }
      }, 1500);
    }

    function activate() {
      const wv = findWebview();
      if (!wv || typeof wv.executeJavaScript !== 'function') {
        anno.set({ unsupported: true });
        setTimeout(() => anno.set({ unsupported: false }), 2400);
        return;
      }
      session.webview = wv;
      session.ready = false;
      session.attempts = 0;
      anno.set({ active: true, items: [], url: '', pinsHidden: false });

      const onConsole = (event) => {
        const msg = event && typeof event.message === 'string' ? event.message : '';
        if (!msg.startsWith(PREFIX)) return;
        let payload;
        try { payload = JSON.parse(msg.slice(PREFIX.length)); } catch (_) { return; }
        if (payload.type === 'ready') {
          session.ready = true;
          if (session.readyTimer) { clearTimeout(session.readyTimer); session.readyTimer = null; }
          console.info('[browser-annotation] picker ready');
        } else if (payload.type === 'comment') {
          anno.set({ items: [...anno.getSnapshot().items, payload], url: payload.url || anno.getSnapshot().url });
        } else if (payload.type === 'exit') {
          deactivate();
        }
      };
      wv.addEventListener('console-message', onConsole);
      session.detach.push(() => wv.removeEventListener('console-message', onConsole));

      const onNav = () => deactivate();
      wv.addEventListener('did-start-loading', onNav);
      session.detach.push(() => wv.removeEventListener('did-start-loading', onNav));

      if (typeof wv.isLoading === 'function' && wv.isLoading()) {
        const onReady = () => { injectPicker(wv); armReadyWatchdog(wv); };
        wv.addEventListener('dom-ready', onReady, { once: true });
        session.detach.push(() => wv.removeEventListener('dom-ready', onReady));
      } else {
        injectPicker(wv);
        armReadyWatchdog(wv);
      }
    }

    function composeMessage(items, url) {
      const head = '【页面批注】' + (url || '');
      const lines = items.map((it) => serializeItem(it));
      return [head, ...lines].join('\n');
    }

    function serializeItem(it) {
      if (it.kind === 'element') {
        const style = [it.color ? '颜色' + it.color : '', it.fontSize ? '字体' + it.fontSize + ' ' + (it.fontFamily || '') : ''].filter(Boolean).join(' ');
        const snippet = it.text ? ' 文本“' + it.text + '”' : '';
        return it.n + '. [元素] ' + it.selector + ' ' + it.width + '×' + it.height + ' @(' + it.docX + ',' + it.docY + ')' + (style ? ' ' + style : '') + snippet + ' —— ' + it.comment;
      }
      return it.n + '. [区域] (' + it.rect.x + ',' + it.rect.y + ') ' + it.rect.w + '×' + it.rect.h + ' —— ' + it.comment;
    }

    // Borrow the live session/agent-scoped context for the composer of the
    // on-screen session, so chip insertion events reach the input shell.
    function currentSessionId() {
      if (bridge.sessionId) return bridge.sessionId;
      try {
        const mounted = hostServices.sidebarRight && hostServices.sidebarRight.mounted;
        if (mounted && typeof mounted.getSnapshot === 'function') return mounted.getSnapshot() || null;
      } catch (_) {}
      return null;
    }

    function sessionCtx(sessionId) {
      const sessions = hostServices.sessions;
      if (!sessions || !sessionId) return null;
      try {
        const binding = typeof sessions.binding === 'function' ? sessions.binding(sessionId) : void 0;
        if (binding && binding.ctx && typeof binding.ctx.bail === 'function') return binding.ctx;
      } catch (_) {}
      try {
        const scope = typeof sessions.scope === 'function' ? sessions.scope(sessionId) : void 0;
        if (scope && typeof scope.bail === 'function') return scope;
      } catch (_) {}
      return null;
    }

    // ---- screenshot helpers ----
    function loadImageEl(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('image decode failed'));
        img.src = src;
      });
    }

    function dataUrlToFile(dataUrl, name) {
      const comma = dataUrl.indexOf(',');
      const mime = (/^data:([^;,]+)/.exec(dataUrl.slice(0, comma)) || [])[1] || 'image/png';
      const bin = atob(dataUrl.slice(comma + 1));
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new File([bytes], name, { type: mime });
    }

    // Capture the webview with chrome hidden (badges stay), then crop one
    // thumbnail per pin around its current viewport rect. Each thumbnail gets
    // a dark caption strip (badge n + selector/region + comment) baked into
    // the image, so the vision model reads the annotation from the picture
    // itself and no separate text/file block is needed.
    async function captureAnnotationThumbs(wv, wvCssWidth, items, url) {
      if (typeof wv.capturePage !== 'function') return [];
      let dataUrl;
      try {
        guestCall('window.__dshAnnoChrome && window.__dshAnnoChrome(false)');
        await new Promise((resolve) => setTimeout(resolve, 80));
        const image = await wv.capturePage();
        dataUrl = image.toDataURL();
      } finally {
        guestCall('window.__dshAnnoChrome && window.__dshAnnoChrome(true)');
      }
      if (!dataUrl) return [];
      const img = await loadImageEl(dataUrl);
      const scale = img.naturalWidth / Math.max(1, wvCssWidth);
      let rects = [];
      try {
        const info = await wv.executeJavaScript('window.__dshAnnoRects ? window.__dshAnnoRects() : null', true);
        if (info && Array.isArray(info.rects)) rects = info.rects;
      } catch (_) {}
      const byN = new Map(items.map((it) => [it.n, it]));
      const PAD = 48;
      const files = [];
      for (const r of rects) {
        const sx = Math.max(0, Math.floor((r.x - PAD) * scale));
        const sy = Math.max(0, Math.floor((r.y - PAD) * scale));
        const ex = Math.min(img.naturalWidth, Math.ceil((r.x + r.w + PAD) * scale));
        const ey = Math.min(img.naturalHeight, Math.ceil((r.y + r.h + PAD) * scale));
        const sw = ex - sx;
        const sh = ey - sy;
        if (sw < 8 || sh < 8) continue;
        const item = byN.get(r.n);
        const isFirst = files.length === 0;
        const capH = Math.round((isFirst && url ? 44 : 30) * scale);
        const canvas = document.createElement('canvas');
        canvas.width = sw;
        canvas.height = sh + capH;
        const g = canvas.getContext('2d');
        g.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
        g.fillStyle = '#1f1f1f';
        g.fillRect(0, sh, sw, capH);
        const fontPx = Math.round(11 * scale);
        const textPad = Math.round(8 * scale);
        const maxW = sw - textPad * 2;
        let cy = sh + capH - Math.round(15 * scale) + Math.round(isFirst && url ? 7 * scale : 0);
        if (isFirst && url) {
          g.fillStyle = 'rgba(255,255,255,0.55)';
          g.font = Math.round(10 * scale) + 'px -apple-system, system-ui, sans-serif';
          g.textBaseline = 'middle';
          g.fillText(ellipsize(g, url, maxW), textPad, sh + Math.round(11 * scale));
        }
        if (item) {
          const subject = item.kind === 'element' ? item.selector : '区域 ' + item.rect.w + '×' + item.rect.h;
          const caption = r.n + '. ' + subject + ' —— ' + item.comment;
          g.fillStyle = '#fff';
          g.font = fontPx + 'px -apple-system, system-ui, sans-serif';
          g.textBaseline = 'middle';
          g.fillText(ellipsize(g, caption, maxW), textPad, cy);
        }
        files.push({ n: r.n, file: dataUrlToFile(canvas.toDataURL('image/png'), 'annotation-' + r.n + '.png') });
      }
      if (files.length === 0) files.push({ n: 0, file: dataUrlToFile(dataUrl, 'annotation-page.png') });
      return files;
    }

    function ellipsize(g, text, maxWidth) {
      if (g.measureText(text).width <= maxWidth) return text;
      let t = text;
      while (t.length > 1 && g.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
      return t + '…';
    }

    // Codex-style send: cropped screenshot thumbnails as image attachments +
    // one aggregate chip「N 条注释」whose serialization expands to the full
    // annotation text. The user's draft text stays untouched.
    async function sendToComposer() {
      const { items, url } = anno.getSnapshot();
      if (items.length === 0) { deactivate(); return; }
      if (anno.getSnapshot().sending) return;
      anno.set({ sending: true });
      try {
        const actions = bridge.inputActions;
        const sessionId = currentSessionId();
        const scopeCtx = sessionCtx(sessionId);
        const wv = session.webview;

        // 1. Screenshot thumbnails with baked caption strips → image attachments.
        //    No file card, no text block: details travel inside the images.
        lastSendHadImages = false;
        const conversation = conversationService();
        const canAttach = conversation && actions && typeof actions.addAttachments === 'function' && sessionId;
        if (canAttach && wv) {
          try {
            const wvWidth = wv.getBoundingClientRect().width;
            const thumbs = await captureAnnotationThumbs(wv, wvWidth, items, url);
            if (thumbs.length > 0) {
              const drafts = conversation.createDrafts(sessionId, thumbs.map((x) => x.file));
              const ids = drafts.map((d) => d.id);
              if (ids.length > 0) {
                actions.addAttachments(ids);
                lastSendHadImages = true;
              }
              console.info('[browser-annotation] attached ' + ids.length + ' captioned thumbnail(s)');
            }
          } catch (error) {
            console.error('[browser-annotation] screenshot capture failed (continuing without images):', error);
          }
        } else {
          console.warn('[browser-annotation] screenshots skipped: wv=' + !!wv + ' conversation=' + !!conversation + ' addAttachments=' + !!(actions && actions.addAttachments) + ' sessionId=' + sessionId);
        }

        // 2. One aggregate chip in the draft text flow.
        if (actions && scopeCtx && typeof actions.captureInsertion === 'function') {
          try {
            const span = actions.captureInsertion();
            const reference = {
              source: 'page-annotation',
              ref: JSON.stringify({ url, items }),
              label: items.length + ' 条注释',
              clipboardText: '【页面批注】' + items.length + ' 条注释 ' + (url || ''),
            };
            const ok = scopeCtx.bail(scopeCtx, 'slash/input-insert-reference', { reference, span }) === true;
            if (ok) console.info('[browser-annotation] inserted aggregate annotation chip');
            else throw new Error('insert-reference returned false');
          } catch (error) {
            console.error('[browser-annotation] chip insertion failed; plain-text draft fallback:', error);
            const prior = bridge.draft && bridge.draft.trim() ? bridge.draft.trim() + '\n\n' : '';
            try { actions.setDraft(prior + composeMessage(items, url)); } catch (e2) { console.error('[browser-annotation] setDraft failed:', e2); }
          }
        } else if (actions) {
          console.warn('[browser-annotation] no session scope (sessionId=' + sessionId + '); plain-text draft');
          const prior = bridge.draft && bridge.draft.trim() ? bridge.draft.trim() + '\n\n' : '';
          try { actions.setDraft(prior + composeMessage(items, url)); } catch (error) { console.error('[browser-annotation] setDraft failed:', error); }
        } else if (navigator.clipboard) {
          console.warn('[browser-annotation] no composer bridge; copied to clipboard');
          navigator.clipboard.writeText(composeMessage(items, url)).catch(() => {});
        }
      } finally {
        anno.set({ sending: false });
        deactivate();
      }
    }

    // ---- React pieces ----
    const LocaleContext = React.createContext((k) => k);

    function ComposerBridge(props) {
      const draft = props.useInput ? props.useInput((s) => s.draft) : '';
      React.useEffect(() => {
        bridge.inputActions = props.inputActions || null;
        bridge.sessionId = props.sessionId || null;
        return () => { if (bridge.inputActions === (props.inputActions || null)) { bridge.inputActions = null; bridge.sessionId = null; } };
      }, [props.inputActions, props.sessionId]);
      React.useEffect(() => { bridge.draft = draft || ''; }, [draft]);
      return null;
    }

    function BarIconButton({ label, onClick, disabled, children }) {
      return h('button', {
        type: 'button',
        title: label,
        'aria-label': label,
        onClick,
        disabled,
        style: {
          width: 30, height: 30, border: 'none', borderRadius: 15,
          background: 'transparent', color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.72)',
          cursor: disabled ? 'default' : 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        },
      }, children);
    }

    function AnnotationOverlay() {
      const state = React.useSyncExternalStore(anno.subscribe, anno.getSnapshot);
      const rect = useViewport();
      const t = React.useContext(LocaleContext);

      React.useEffect(() => {
        if (!state.active) return;
        const onKey = (e) => { if (e.key === 'Escape') deactivate(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [state.active]);

      if (!rect) return null;

      const noticeEl = state.notice
        ? h('div', {
            key: 'notice',
            style: {
              position: 'fixed', left: rect.left + rect.width / 2, top: rect.top + 12,
              transform: 'translateX(-50%)', zIndex: 10002, pointerEvents: 'none',
              background: '#c0362c', color: '#fff', fontSize: 12, padding: '7px 14px',
              borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.28)',
              fontFamily: 'system-ui, -apple-system, sans-serif', whiteSpace: 'nowrap',
            },
          }, t(state.notice))
        : null;

      if (!state.active) {
        return [
          noticeEl,
          h('div', {
            key: 'entry',
            style: {
              position: 'fixed', left: rect.left, top: rect.top, width: rect.width, height: 0,
              zIndex: 10000, pointerEvents: 'none', fontFamily: 'system-ui, -apple-system, sans-serif',
            },
          },
            state.unsupported
              ? h('div', { style: { position: 'absolute', top: 10, right: 10, background: '#1f1f1f', color: '#fff', fontSize: 12, padding: '7px 12px', borderRadius: 10, pointerEvents: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.28)' } }, t('unsupported'))
              : h('button', {
                  type: 'button',
                  title: t('toggle.tip'),
                  'aria-label': t('toggle.tip'),
                  onClick: activate,
                  style: {
                    position: 'absolute', top: 8, right: 10, width: 32, height: 32,
                    borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.94)', color: '#1f1f1f',
                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    pointerEvents: 'auto', boxShadow: '0 1px 6px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.06)',
                  },
                }, h(Icon, { name: 'inspect', size: 16 }))
          ),
        ];
      }

      const count = state.items.length;
      return [
        noticeEl,
        h('div', {
          key: 'bar',
          style: {
            position: 'fixed',
            left: Math.max(8, rect.left + rect.width / 2 - 220),
            top: rect.top + rect.height - 56,
            zIndex: 10000,
            pointerEvents: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            userSelect: 'none',
          },
        }, h('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: 2, height: 44,
          background: '#1f1f1f', borderRadius: 22, padding: '0 6px 0 12px',
          boxShadow: '0 10px 34px rgba(0,0,0,0.32)', pointerEvents: 'auto', color: '#fff',
        },
      }, [
        h('span', { key: 'grip', style: { display: 'inline-flex', color: 'rgba(255,255,255,0.4)', marginRight: 2 } }, h(Icon, { name: 'gripVertical', size: 14 })),
        h('span', { key: 'count', style: { fontSize: 12.5, fontWeight: 500, marginRight: 8, whiteSpace: 'nowrap' } }, t('bar.count') + ' · ' + count),
        h(BarIconButton, {
          key: 'locate', label: t('bar.locate'), disabled: count === 0,
          onClick: () => guestCall('window.__dshAnnoFlash && window.__dshAnnoFlash()'),
        }, h(Icon, { name: 'locate', size: 15 })),
        h(BarIconButton, {
          key: 'eye', label: state.pinsHidden ? t('bar.show') : t('bar.hide'), disabled: count === 0,
          onClick: () => {
            const next = !state.pinsHidden;
            anno.set({ pinsHidden: next });
            guestCall('window.__dshAnnoTogglePins && window.__dshAnnoTogglePins(' + next + ')');
          },
        }, h(Icon, { name: state.pinsHidden ? 'eye' : 'eyeOff', size: 15 })),
        h(BarIconButton, {
          key: 'copy', label: t('bar.copy'), disabled: count === 0,
          onClick: () => {
            const { items, url } = anno.getSnapshot();
            if (navigator.clipboard && items.length) navigator.clipboard.writeText(composeMessage(items, url)).catch(() => {});
          },
        }, h(Icon, { name: 'copy', size: 15 })),
        h(BarIconButton, {
          key: 'clear', label: t('bar.clear'), disabled: count === 0,
          onClick: () => {
            anno.set({ items: [] });
            guestCall('window.__dshAnnoClear && window.__dshAnnoClear()');
          },
        }, h(Icon, { name: 'trash', size: 15 })),
        h('button', {
          key: 'send', type: 'button',
          onClick: sendToComposer,
          disabled: count === 0 || state.sending,
          style: {
            height: 32, padding: '0 16px', margin: '0 2px 0 4px', border: 'none', borderRadius: 16,
            background: count === 0 || state.sending ? 'rgba(53,116,240,0.45)' : BLUE, color: '#fff',
            cursor: count === 0 || state.sending ? 'default' : 'pointer', fontSize: 12.5, fontWeight: 500, flex: 'none',
          },
        }, state.sending ? '…' : t('bar.send')),
        h(BarIconButton, { key: 'close', label: t('bar.close'), onClick: deactivate }, h(Icon, { name: 'x', size: 15 })),
      ])),
      ];
    }

    function safeEffect(label, fn) {
      try { return fn(); } catch (error) { console.error('[browser-annotation] ' + label + ' failed:', error); }
    }

    // ---- client plugin ----
    return {
      inject: ['slots', 'locale', 'sessions', 'inputTriggers', 'sidebarRight'],
      apply(ctx) {
        console.info('[browser-annotation] client apply (chips v2)');
        safeEffect('locale', () => ctx.effect(() => ctx.locale.register(NAMESPACE, { en, zh }), 'browser-annotation.locale'));
        const t = ctx.locale.bind(NAMESPACE);
        hostServices.sessions = ctx.get('sessions') || null;
        hostServices.sidebarRight = ctx.get('sidebarRight') || null;
        hostServices.ctx = ctx;

        // Reference source owning annotation chips: the chip is composer
        // presentation only — `codec.serialize` contributes no wire text, so
        // the sent message shows just the captioned thumbnail cards. The
        // source never surfaces in the @ menu (empty candidates), it exists
        // so inserted chips resolve an owner instead of blocking the send.
        safeEffect('chip-source', () => ctx.effect(() => ctx.inputTriggers.registerSource({
          trigger: '@',
          name: 'page-annotation',
          showGroupTitle: false,
          candidates: async () => [],
          codec: {
            clipboardText: (ref) => {
              try {
                const data = JSON.parse(ref);
                if (Array.isArray(data.items)) return '【页面批注】' + data.items.length + ' 条注释 ' + (data.url || '');
                return '[批注' + data.n + '] ' + data.comment;
              } catch (_) { return ref; }
            },
            serialize: (ref) => {
              // Presentation-only chip: when captioned thumbnails were
              // attached the wire text is empty (no bubble without typed
              // body); otherwise fall back to the full text so the agent
              // still receives the details.
              try {
                const data = JSON.parse(ref);
                if (lastSendHadImages) return Promise.resolve('');
                const list = Array.isArray(data.items) ? data.items : [data];
                return Promise.resolve(composeMessage(list, data.url || ''));
              } catch (_) { return Promise.resolve(''); }
            },
          },
        }), 'browser-annotation.chip-source'));

        safeEffect('composer-bridge', () => ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'browser-annotation-bridge',
          order: 100,
        }, ComposerBridge)), 'browser-annotation.bridge'));

        safeEffect('overlay', () => ctx.effect(() => ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'browser-annotation-overlay',
          order: 100,
        }, function AnnotationOverlayWrapper() {
          return h(LocaleContext.Provider, { value: t }, h(AnnotationOverlay));
        })), 'browser-annotation.overlay'));
      },
    };
  },
});

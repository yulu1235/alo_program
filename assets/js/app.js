/* =========================================================
   系统实施运维学习路径 · 交互脚本
   纯原生 JS，无依赖，file:// 可用
   ========================================================= */
(function () {
  'use strict';

  var LS = {
    theme: 'alo.theme',
    star: 'alo.star',
    seen: 'alo.seen'
  };

  /* ---------------- 主题 ---------------- */
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = t === 'light' ? '☾' : '☀';
  }
  function initTheme() {
    var saved = localStorage.getItem(LS.theme) || 'dark';
    applyTheme(saved);
    var btn = document.getElementById('themeBtn');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        localStorage.setItem(LS.theme, next);
        applyTheme(next);
      });
    }
  }

  /* ---------------- 导航高亮 ---------------- */
  function initNav() {
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a').forEach(function (a) {
      var href = a.getAttribute('href').toLowerCase();
      if (href === page) a.classList.add('active');
    });
  }

  /* ---------------- 星标（localStorage） ---------------- */
  function readStar() {
    try { return JSON.parse(localStorage.getItem(LS.star) || '{}'); } catch (e) { return {}; }
  }
  function writeStar(o) { localStorage.setItem(LS.star, JSON.stringify(o)); }

  /* ---------------- 工具 ---------------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  var DIFF_CLASS = { 初级: 'green', 中级: 'blue', 高级: 'violet', 专家: 'pink' };

  /* =========================================================
     面试题库
     ========================================================= */
  function renderInterview(root) {
    var data = window.QUESTIONS || [];
    var state = { mod: 'all', diff: 'all', kw: '', starOnly: false };
    var starred = readStar();

    var mods = ['all'];
    data.forEach(function (q) { if (mods.indexOf(q.mod) === -1) mods.push(q.mod); });

    root.innerHTML =
      '<div class="toolbar">' +
        '<input type="search" id="qSearch" placeholder="搜索题目 / 关键词，例如 三次握手、主从、慢查询…">' +
        '<select id="qDiff">' +
          '<option value="all">全部难度</option>' +
          '<option>初级</option><option>中级</option><option>高级</option>' +
        '</select>' +
        '<button class="chip" id="qStarFilter">只看已掌握</button>' +
        '<button class="chip" id="qRandom">随机抽一题</button>' +
        '<span class="dim small" id="qCount" style="margin-left:auto"></span>' +
      '</div>' +
      '<div class="chips" id="qMods" style="margin-bottom:20px"></div>' +
      '<div class="q-list" id="qList"></div>';

    var modsBox = root.querySelector('#qMods');
    mods.forEach(function (m) {
      var b = el('button', 'chip' + (m === 'all' ? ' on' : ''), m === 'all' ? '全部分类' : esc(m));
      b.dataset.mod = m;
      b.addEventListener('click', function () {
        state.mod = m;
        modsBox.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        paint();
      });
      modsBox.appendChild(b);
    });

    var search = root.querySelector('#qSearch');
    search.addEventListener('input', function () { state.kw = this.value.trim().toLowerCase(); paint(); });
    root.querySelector('#qDiff').addEventListener('change', function () { state.diff = this.value; paint(); });

    var starBtn = root.querySelector('#qStarFilter');
    starBtn.addEventListener('click', function () {
      state.starOnly = !state.starOnly;
      starBtn.classList.toggle('on', state.starOnly);
      paint();
    });

    root.querySelector('#qRandom').addEventListener('click', function () {
      var pool = data.filter(match);
      if (!pool.length) return alert('当前筛选下没有题目，先放宽条件吧');
      var pick = pool[Math.floor(Math.random() * pool.length)];
      state.mod = 'all'; state.diff = 'all'; state.kw = ''; state.starOnly = false;
      search.value = ''; root.querySelector('#qDiff').value = 'all';
      modsBox.querySelectorAll('.chip').forEach(function (x) { x.classList.toggle('on', x.dataset.mod === 'all'); });
      starBtn.classList.remove('on');
      paint();
      var node = document.getElementById('q-' + pick.id);
      if (node) {
        node.classList.add('open');
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        node.style.outline = '2px solid var(--brand)';
        setTimeout(function () { node.style.outline = ''; }, 1600);
      }
    });

    function match(q) {
      if (state.mod !== 'all' && q.mod !== state.mod) return false;
      if (state.diff !== 'all' && q.diff !== state.diff) return false;
      if (state.starOnly && !starred['q' + q.id]) return false;
      if (state.kw) {
        var hay = (q.q + ' ' + (q.a || '') + ' ' + q.mod + ' ' + (q.tags || []).join(' ')).toLowerCase();
        if (hay.indexOf(state.kw) === -1) return false;
      }
      return true;
    }

    function paint() {
      var list = root.querySelector('#qList');
      var pool = data.filter(match);
      root.querySelector('#qCount').textContent = '共 ' + pool.length + ' 题 / 全库 ' + data.length + ' 题';
      if (!pool.length) {
        list.innerHTML = '<div class="card center dim">没有匹配的题目，换个关键词试试～</div>';
        return;
      }
      list.innerHTML = pool.map(function (q) {
        var tags = (q.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
        var on = starred['q' + q.id];
        return '' +
          '<article class="q-item" id="q-' + q.id + '">' +
            '<div class="q-head">' +
              '<div class="q-idx">#' + q.id + '</div>' +
              '<div class="q-title">' + esc(q.q) + '</div>' +
              '<div class="q-badges">' +
                '<span class="tag ' + (DIFF_CLASS[q.diff] || '') + '">' + esc(q.diff) + '</span>' +
                '<button class="star' + (on ? ' on' : '') + '" data-id="' + q.id + '" title="标记已掌握">★</button>' +
              '</div>' +
            '</div>' +
            '<div class="q-body">' +
              (q.a || '') +
              (q.cmd ? '<pre>' + esc(q.cmd) + '</pre>' : '') +
              (q.tip ? '<div class="q-tip"><b>面试官想听：</b>' + q.tip + '</div>' : '') +
              (tags ? '<div class="tags" style="margin-top:12px">' + tags + '</div>' : '') +
            '</div>' +
          '</article>';
      }).join('');

      list.querySelectorAll('.q-head').forEach(function (h) {
        h.addEventListener('click', function () {
          h.parentElement.classList.toggle('open');
        });
      });
      list.querySelectorAll('.star').forEach(function (s) {
        s.addEventListener('click', function (ev) {
          ev.stopPropagation();
          var id = 'q' + this.dataset.id;
          if (starred[id]) { delete starred[id]; this.classList.remove('on'); }
          else { starred[id] = 1; this.classList.add('on'); }
          writeStar(starred);
        });
      });
    }

    paint();
  }

  /* =========================================================
     知识点
     ========================================================= */
  function renderKnowledge(root) {
    var mods = window.MODULES || [];
    var state = { kw: '' };

    root.innerHTML =
      '<div class="toolbar">' +
        '<input type="search" id="kSearch" placeholder="搜索知识点，例如 swap、binlog、iptables、RAID…">' +
        '<button class="chip" id="kExpand">全部展开</button>' +
        '<button class="chip" id="kCollapse">全部收起</button>' +
        '<span class="dim small" id="kCount" style="margin-left:auto"></span>' +
      '</div>' +
      '<div id="kList"></div>';

    function paint() {
      var list = root.querySelector('#kList');
      var kw = state.kw;
      var shown = 0;
      list.innerHTML = mods.map(function (m, mi) {
        var items = m.items.filter(function (it) {
          if (!kw) return true;
          var hay = (it.t + ' ' + (it.d || []).join(' ') + ' ' + (it.cmd || '')).toLowerCase();
          return hay.indexOf(kw) !== -1;
        });
        if (!items.length) return '';
        shown += items.length;
        var body = items.map(function (it) {
          return '' +
            '<div class="kp">' +
              '<h4>' + esc(it.t) +
                '<span class="lv">' + esc(it.lv || '必会') + '</span>' +
                (it.must ? '<span class="must">高频</span>' : '') +
              '</h4>' +
              (it.d && it.d.length ? '<ul class="clean">' + it.d.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') +
              (it.cmd ? '<pre>' + esc(it.cmd) + '</pre>' : '') +
            '</div>';
        }).join('');
        return '' +
          '<section class="kmod' + (kw ? ' open' : (mi === 0 ? ' open' : '')) + '">' +
            '<div class="kmod-head">' +
              '<div class="kmod-ico">' + (m.icon || '◆') + '</div>' +
              '<div class="kmod-title"><h3>' + esc(m.name) + '</h3><span>' + esc(m.desc || '') + '</span></div>' +
              '<div class="kmod-caret">▾</div>' +
            '</div>' +
            '<div class="kmod-body">' + body + '</div>' +
          '</section>';
      }).join('');
      root.querySelector('#kCount').textContent = '命中 ' + shown + ' 个知识点';
      list.querySelectorAll('.kmod-head').forEach(function (h) {
        h.addEventListener('click', function () { h.parentElement.classList.toggle('open'); });
      });
    }

    root.querySelector('#kSearch').addEventListener('input', function () { state.kw = this.value.trim().toLowerCase(); paint(); });
    root.querySelector('#kExpand').addEventListener('click', function () {
      root.querySelectorAll('.kmod').forEach(function (k) { k.classList.add('open'); });
    });
    root.querySelector('#kCollapse').addEventListener('click', function () {
      root.querySelectorAll('.kmod').forEach(function (k) { k.classList.remove('open'); });
    });

    paint();
  }

  /* =========================================================
     资源库
     ========================================================= */
  function renderResources(root) {
    var groups = window.RESOURCES || [];
    var state = { kw: '', type: 'all' };

    root.innerHTML =
      '<div class="toolbar">' +
        '<input type="search" id="rSearch" placeholder="搜索资源，例如 官方文档、面试、K8s、等保…">' +
        '<div class="chips" id="rTypes"></div>' +
        '<span class="dim small" id="rCount" style="margin-left:auto"></span>' +
      '</div>' +
      '<div id="rList"></div>';

    var types = ['all'];
    groups.forEach(function (g) { g.items.forEach(function (i) { if (types.indexOf(i.type) === -1) types.push(i.type); }); });

    var tBox = root.querySelector('#rTypes');
    types.forEach(function (t, i) {
      var b = el('button', 'chip' + (i === 0 ? ' on' : ''), t === 'all' ? '全部' : esc(t));
      b.addEventListener('click', function () {
        state.type = t;
        tBox.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        paint();
      });
      tBox.appendChild(b);
    });

    function paint() {
      var list = root.querySelector('#rList');
      var total = 0;
      list.innerHTML = groups.map(function (g) {
        var items = g.items.filter(function (i) {
          if (state.type !== 'all' && i.type !== state.type) return false;
          if (state.kw) {
            var hay = (i.t + ' ' + i.d + ' ' + i.u + ' ' + i.type).toLowerCase();
            if (hay.indexOf(state.kw) === -1) return false;
          }
          return true;
        });
        if (!items.length) return '';
        total += items.length;
        return '' +
          '<section class="res-group">' +
            '<h3>' + esc(g.name) + '</h3>' +
            '<div class="grid c2">' + items.map(function (i) {
              return '' +
                '<a class="link-card" href="' + esc(i.u) + '" target="_blank" rel="noopener noreferrer">' +
                  '<div class="lt">' + esc(i.t) + ' <span class="lv">' + esc(i.type) + '</span></div>' +
                  '<div class="lu">' + esc(i.u) + '</div>' +
                  '<div class="ld">' + esc(i.d) + '</div>' +
                '</a>';
            }).join('') + '</div>' +
          '</section>';
      }).join('') || '<div class="card center dim">没有匹配的资源</div>';
      root.querySelector('#rCount').textContent = '共 ' + total + ' 条资源';
    }

    root.querySelector('#rSearch').addEventListener('input', function () { state.kw = this.value.trim().toLowerCase(); paint(); });
    paint();
  }

  /* ---------------- 启动 ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initNav();

    var qr = document.getElementById('interviewRoot');
    if (qr) renderInterview(qr);

    var kr = document.getElementById('knowledgeRoot');
    if (kr) renderKnowledge(kr);

    var rr = document.getElementById('resourceRoot');
    if (rr) renderResources(rr);

    // 首页时间线折叠
    document.querySelectorAll('[data-fold]').forEach(function (h) {
      h.addEventListener('click', function () {
        var body = h.parentElement.querySelector('[data-fold-body]');
        if (body) body.classList.toggle('hidden');
      });
    });

    // 底部年份
    document.querySelectorAll('[data-year]').forEach(function (n) {
      n.textContent = new Date().getFullYear();
    });
  });
})();

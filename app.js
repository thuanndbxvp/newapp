// ── Giao tiếp backend: pywebview (desktop) hoặc shim (GitHub Pages) ─────
let api = null;
let _booted = false;

const STATIC_NOTICE = [
  '# Thông báo bản web HTML',
  'Bản này chạy trên GitHub Pages nên chỉ mở các liên kết web.',
  'Để chạy app .exe, hãy dùng bản Desktop launcher.',
  'Trang chủ: https://update.ai86.click/'
].join('\n');

const STATIC_ENTRIES = [
  {
    name: 'AutoSync V3.5 with Capcut',
    desc: 'Bản AutoSync tích hợp quy trình Capcut theo hướng dẫn mới.',
    icon: 'icon_autosync_v3.png',
    accent: '#A855F7',
    type: 'app',
    target: 'Applications/V3.4/AutoSync V3.4_with Capcut.exe',
    info: 'App chính · V3.5 · Capcut',
    needs_license: true,
    step: 'main',
    main_row: 1,
    main_full: true,
    download_url: 'https://drive.google.com/drive/folders/1XDvmaUn3m74KyJ31yGfIoqncC33ByuIw',
    guide_tab: 0,
  },
  {
    name: 'Phân Cảnh AI',
    desc: 'Tự động chia kịch bản thành các prompt tạo ảnh. Hỗ trợ Gemini 3 Pro/Flash, tuỳ chỉnh phong cách và tỷ lệ khung hình.',
    notice: '⚠️ Lưu ý: Đọc kỹ hướng dẫn ngay trên trang phân cảnh.',
    icon: 'icon_phancanh_ai.png',
    accent: '#10B981',
    type: 'url',
    target: 'https://ai.studio/apps/9abadf1d-6ab4-4191-aad4-f0dd807ee5ac',
    info: 'ai.studio · App 1',
    needs_license: false,
    step: 1,
    guide_tab: 4,
  },
  {
    name: 'Phân Cảnh AI 2',
    desc: 'Phân cảnh và tạo ảnh có đồng nhất nhân vật (không tạo video).',
    notice: '⚠️ Lưu ý: Đọc kỹ hướng dẫn ngay trên trang phân cảnh.',
    icon: 'phancanh.png',
    accent: '#14B8A6',
    type: 'url',
    target: 'https://ai.studio/apps/2d2f9883-895c-4aed-8912-6f60f2229ec9',
    info: 'ai.studio · App 2',
    needs_license: false,
    step: 1,
    guide_tab: 4,
  },
  {
    name: 'Phân Cảnh · ChatGPT GPTs',
    desc: 'Link GPTs phân cảnh kịch bản AI86 để dự phòng và mở rộng workflow.',
    notice: '⚠️ Link dự phòng bổ sung.',
    icon: 'icon_storyboard_ai.png',
    accent: '#22C55E',
    type: 'url',
    target: 'https://chatgpt.com/g/g-69c3916215b481919b264962526e40ba-phan-canh-kich-ban-ai86',
    info: 'chatgpt.com · GPTs',
    needs_license: false,
    step: 1,
    guide_tab: 4,
  },
  {
    name: 'Phân Cảnh · Gemini Gem',
    desc: 'Link Gemini Gem phân cảnh để dự phòng khi cần workflow thay thế.',
    notice: '⚠️ Link dự phòng bổ sung.',
    icon: '5.png',
    accent: '#0EA5A4',
    type: 'url',
    target: 'https://gemini.google.com/gem/5513c40fa705',
    info: 'gemini.google.com · Gem',
    needs_license: false,
    step: 1,
    guide_tab: 4,
  },
  {
    name: 'AI86 TTS box',
    desc: 'App bản free hỗ trợ tiếng Anh, Nhật, Trung',
    icon: '3.png',
    accent: '#3B82F6',
    type: 'url',
    target: 'https://aistudio.google.com/generate-speech?model=gemini-2.5-flash-preview-tts',
    info: 'App tặng kèm khi mua tool Đồng bộ',
    needs_license: false,
    step: 'main',
    download_url: 'https://drive.google.com/drive/folders/1ani_jign0lWuI5o77vGZDo8ogHIF7A06',
    guide_video_url: 'https://www.youtube.com/watch?v=RYA14E0W5N4&list=PLg4WykTKAcjtcFDV3vnjfZN_Aqld0q29I&index=2',
  },
  {
    name: 'TTS · StudyAI',
    desc: 'Công cụ text-to-speech thay thế, nhanh và ổn định. Dùng cho các tác vụ TTS hàng ngày không cần VPN.',
    icon: '4.png',
    accent: '#F59E0B',
    type: 'url',
    target: 'https://tts.studyai.click/',
    info: 'tts.studyai.click · Thay thế',
    needs_license: false,
    step: 'main',
    guide_video_url: 'https://www.youtube.com/watch?v=17a4u076iOc&list=PLg4WykTKAcjtE3KELuw81TzMyiQwkwauv&index=5',
    info_btn: 'ⓘ  Hướng dẫn lấy API',
  },
  {
    name: 'Tạo Video Flow 1',
    desc: 'Tạo video AI trên Google Flow với quy trình tự động. Cần cài Extension Chrome: Auto Flow để thao tác nhanh.',
    notice: 'Tải về, giải nén file này và làm theo video hướng dẫn. <a href="#" class="notice-link" onclick="openUrl(\'https://drive.google.com/file/d/1GyvlctO6-xtRqfolFOXsG5Z6nNUJSAbG/view\');return false;">Tải về</a> và xem hướng dẫn tại <a href="#" class="notice-link" onclick="openUrl(\'https://youtu.be/zVzgcFJhTlo\');return false;">ở đây</a>, chúng tôi không giải thích gì thêm.',
    icon: 'whisk_flow.png',
    accent: '#06B6D4',
    type: 'url',
    target: 'https://labs.google/fx/vi/tools/flow',
    info: 'labs.google · Whisk',
    needs_license: false,
    step: 99,
    action_btn: '↗ Truy cập Flow',
    guide_video_url: 'https://youtu.be/zVzgcFJhTlo',
    guide_tab: 4,
  },
  {
    name: 'Tạo Video Flow 2',
    desc: 'Tạo video AI trên Google Flow với quy trình tự động. Cần cài Extension Chrome: Auto Flow để thao tác nhanh.',
    notice: 'Tải về, giải nén file này và làm theo video hướng dẫn. <a href="#" class="notice-link" onclick="openUrl(\'https://drive.google.com/file/d/1BpIFga3NQrjcmloe-d80J1Ri1gmWJFPT/view\');return false;">Tải về</a> và xem hướng dẫn tại <a href="#" class="notice-link" onclick="openUrl(\'https://www.youtube.com/watch?v=O5WF_tLKtyg&list=PLg4WykTKAcjtE3KELuw81TzMyiQwkwauv&index=7&t=1s\');return false;">ở đây</a>, chúng tôi không giải thích gì thêm.',
    icon: 'whisk_flow.png',
    accent: '#8B5CF6',
    type: 'url',
    target: 'https://labs.google/fx/vi/tools/flow',
    info: 'labs.google · Flow',
    needs_license: false,
    step: 99,
    action_btn: '↗ Truy cập Flow',
    guide_video_url: 'https://www.youtube.com/watch?v=O5WF_tLKtyg&list=PLg4WykTKAcjtE3KELuw81TzMyiQwkwauv&index=7&t=1s',
    guide_tab: 4,
  },
];

const THEME_KEY = 'applauncher_theme';
const THEMES = ['violet', 'ocean', 'sunset'];

function applyTheme(theme) {
  const resolved = THEMES.includes(theme) ? theme : 'sunset';
  document.body.setAttribute('data-theme', resolved);

  const select = document.getElementById('themeSelect');
  if (select) select.value = resolved;
}

function mountThemeSwitcherInHeader() {
  const headerRight = document.querySelector('.header-right');
  const guideBtn = document.querySelector('.btn-guide');
  const toolsBadge = document.getElementById('toolsCount');
  if (!headerRight) return;

  // Gom toàn bộ theme switcher (nếu lỡ xuất hiện ở hero do cache cũ), giữ lại 1 bản duy nhất.
  const allSwitchers = Array.from(document.querySelectorAll('.theme-switcher'));
  let switcher = allSwitchers.find((el) => el.id === 'themeSwitcher') || allSwitchers[0] || null;
  if (!switcher) return;

  allSwitchers.forEach((el) => {
    if (el !== switcher) el.remove();
  });

  if (!switcher.id) switcher.id = 'themeSwitcher';

  // Luôn đặt ngay bên phải nút Hướng dẫn và bên trái badge số công cụ.
  if (guideBtn && guideBtn.parentElement === headerRight) {
    headerRight.insertBefore(switcher, toolsBadge || guideBtn.nextSibling);
  } else {
    headerRight.appendChild(switcher);
  }
}

function initThemeSwitcher() {
  mountThemeSwitcherInHeader();

  const switcher = document.getElementById('themeSwitcher');
  const saved = localStorage.getItem(THEME_KEY) || 'sunset';
  applyTheme(saved);

  if (!switcher) return;
  const select = document.getElementById('themeSelect');
  if (!select) return;

  select.addEventListener('change', () => {
    const theme = select.value || 'sunset';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  });
}

function createBrowserApi() {
  const storage = {
    getLicense: () => localStorage.getItem('applauncher_license_key') || '',
    setLicense: (k) => localStorage.setItem('applauncher_license_key', (k || '').trim()),
    getHidden: () => {
      try {
        return new Set(JSON.parse(localStorage.getItem('applauncher_hidden_apps') || '[]'));
      } catch {
        return new Set();
      }
    },
    setHidden: (set) => localStorage.setItem('applauncher_hidden_apps', JSON.stringify(Array.from(set))),
  };

  return {
    async get_entries(expert = false) {
      const hidden = storage.getHidden();
      return STATIC_ENTRIES
        .filter(e => expert || !hidden.has(e.name))
        .map(e => ({ ...e, has_file: !e.download_url }));
    },
    async get_all_entries() {
      return STATIC_ENTRIES.map(e => ({ ...e, has_file: !e.download_url }));
    },
    async get_hidden_apps() {
      const hidden = storage.getHidden();
      const result = {};
      for (const e of STATIC_ENTRIES) result[e.name] = hidden.has(e.name);
      return result;
    },
    async set_app_hidden(appName, hidden) {
      const set = storage.getHidden();
      if (hidden) set.add(appName); else set.delete(appName);
      storage.setHidden(set);
    },
    async get_license_key() { return storage.getLicense(); },
    async save_license_key(key) { storage.setLicense(key); },
    async launch(idx) {
      const e = STATIC_ENTRIES[idx];
      if (!e) return { ok: false, msg: '❌ Entry không tồn tại' };
      if (e.type === 'url') {
        window.open(e.target, '_blank', 'noopener,noreferrer');
        return { ok: true, msg: '✅  Đã mở trình duyệt' };
      }
      return { ok: false, msg: 'ℹ️ Bản web không thể mở file .exe' };
    },
    async download(idx) {
      const e = STATIC_ENTRIES[idx];
      if (e?.download_url) {
        window.open(e.download_url, '_blank', 'noopener,noreferrer');
        return { ok: true, msg: 'Đã mở link tải' };
      }
      return { ok: false, msg: 'Không có link tải' };
    },
    async get_download_progress() { return ''; },
    async fix_ffmpeg() { return { ok: false, msg: 'Chỉ dùng cho bản Desktop' }; },
    async get_notice() { return STATIC_NOTICE; },
    launch_url(url) { window.open(url, '_blank', 'noopener,noreferrer'); },
  };
}

// ── Render cards ──────────────────────────────────────────────────────────
async function init() {
  const entries = await api.get_entries();
  const licKey  = await api.get_license_key();

  const licInput = document.getElementById('licenseInput');
  if (licInput) licInput.value = licKey;

  const toolsCount = document.getElementById('toolsCount');
  if (toolsCount) toolsCount.textContent = entries.length + ' công cụ';

  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
  entries.forEach((e, i) => {
    grid.appendChild(makeCard(e, i));
  });
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return {r,g,b};
}

function makeCard(e, idx) {
  const {r,g,b} = hexToRgb(e.accent);
  const needsDl = e.download_url && !e.has_file;

  const card = document.createElement('div');
  card.className = 'card';
  card.id = 'card-' + idx;
  card.style.setProperty('--card-hover-border', `rgba(${r},${g},${b},0.55)`);
  card.onmouseenter = () => card.style.borderColor = `rgba(${r},${g},${b},0.55)`;
  card.onmouseleave = () => card.style.borderColor = '';

  // Icon
  const iconStyle = `background:rgba(${r},${g},${b},.18);border-color:rgba(${r},${g},${b},.35);color:rgba(${r},${g},${b},.9);`;
  const badgeHtml = e.needs_license
    ? `<span class="card-badge" style="background:rgba(${r},${g},${b},.18);color:rgba(${r},${g},${b},1)">🔑 Bản quyền</span>`
    : '';

  // Action button
  let actionClass, actionText;
  if (needsDl) {
    actionClass = 'download'; actionText = '⬇  Tải về';
  } else if (e.type === 'app') {
    actionClass = 'launch'; actionText = '▶  Mở App';
  } else {
    actionClass = 'open'; actionText = e.action_btn || '↗  Truy cập Tool';
  }

  const infoBtnText = e.info_btn || 'ⓘ  Hướng dẫn';
  const infoBtnClick = `onInfo(${idx})`;
  const backupBtnLabel = e.step === 'main' ? '⬇ Link backup' : '⬇ Bản dự phòng';
  const showPrimaryGuideOnly = e.step === 'main';
  const backupBtnHtml = e.backup_download_url && !showPrimaryGuideOnly
    ? `<button class="btn-flat btn-backup" onclick="openUrl('${e.backup_download_url}')">${backupBtnLabel}</button>`
    : '';
  const fallbackGuideBtnHtml = '';
  const infoBtnClass = showPrimaryGuideOnly ? 'btn-flat btn-guide-wide' : 'btn-flat';

  card.innerHTML = `
    <div class="card-top">
      <div class="card-icon" style="${iconStyle}">
        ${(typeof e.icon === 'string' && e.icon.endsWith('.png')) 
          ? `<img src="images/${e.icon}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">` 
          : e.icon}
      </div>
      <div class="card-meta">
        <div class="card-name">${e.name}</div>
        <div class="card-info-row">
          <span class="card-info" style="color:rgba(${r},${g},${b},1)">${e.info}</span>
          ${badgeHtml}
        </div>
      </div>
    </div>
    <div class="card-desc">${e.desc}</div>
    ${e.notice ? `<div class="card-notice">${e.notice}</div>` : ''}
    <div class="card-divider"></div>
    <div class="card-btns">
      ${!e.extra_url ? `<button class="${infoBtnClass}" onclick="${infoBtnClick}">${infoBtnText}</button>` : ''}
      ${e.extra_url ? `<button class="btn-action open" onclick="openUrl('${e.extra_url}')">${e.extra_btn || '↗  Mở rộng'}</button>` : ''}
      ${e.extra_guide_tab !== undefined ? `<button class="btn-flat" onclick="switchTab(${e.extra_guide_tab});showGuide()">ⓘ HD Flow</button>` : ''}
      ${backupBtnHtml}
      ${fallbackGuideBtnHtml}
      <button class="btn-action ${actionClass}" id="btn-action-${idx}" onclick="onAction(${idx})">${actionText}</button>
    </div>
    ${e.gift_note ? `<div class="card-notice" style="text-align:center">${e.gift_note} <a href="#" class="notice-link" onclick="openUrl('${e.gift_url}');return false;">Tải về</a> và xem hướng dẫn tại <a href="#" class="notice-link" onclick="openUrl('https://www.youtube.com/watch?v=O5WF_tLKtyg&list=PLg4WykTKAcjtE3KELuw81TzMyiQwkwauv&index=6&t=1s');return false;">đây</a>, chúng tôi không giải thích gì thêm.</div>` : ''}
    <div class="card-status" id="status-${idx}"></div>
  `;
  return card;
}

// ── Expert mode ───────────────────────────────────────────────────────────
let expertMode = false;
async function toggleExpert() {
  expertMode = !expertMode;
  const btn = document.getElementById('btnExpert');
  btn.classList.toggle('active', expertMode);
  btn.textContent = expertMode ? '✅ Chuyên gia' : '☑ Chuyên gia';

  // Show/hide visibility settings
  const settingsPanel = document.getElementById('visibilitySettings');
  settingsPanel.style.display = expertMode ? 'block' : 'none';

  if (expertMode) {
    await renderVisibilitySettings();
  }

  await reloadGrid();
}

async function renderVisibilitySettings() {
  const grid = document.getElementById('visibilityGrid');
  grid.innerHTML = '';

  const hiddenApps = await api.get_hidden_apps();

  // Get all entries (including hidden ones for expert mode)
  const entries = await api.get_entries();

  // Also get entries that are hidden in normal mode
  const allEntries = await api.get_entries_expert_all ? await api.get_entries_expert_all() : entries;

  // Use cached ENTRIES from backend for full list
  const response = await api.get_all_entries ? await api.get_all_entries() : entries;

  for (const e of response) {
    const isHidden = hiddenApps[e.name] === true;
    const item = document.createElement('label');
    item.className = 'visibility-item' + (isHidden ? ' hidden' : '');
    item.innerHTML = `
      <input type="checkbox" ${!isHidden ? 'checked' : ''} onchange="toggleAppVisibility('${e.name}', this.checked)">
      <span>${e.icon || '📦'} ${e.name}</span>
    `;
    grid.appendChild(item);
  }
}

async function toggleAppVisibility(appName, visible) {
  await api.set_app_hidden(appName, !visible);
  await renderVisibilitySettings();
  await reloadGrid();
}

let echoVisible = false;
function toggleEcho() {
  const input = document.getElementById('licenseInput');
  const eye = document.getElementById('btnEye');
  if (!input || !eye) return;
  echoVisible = !echoVisible;
  input.type = echoVisible ? 'text' : 'password';
  eye.textContent = echoVisible ? '🙈' : '👁';
}

async function saveKey() {
  const input = document.getElementById('licenseInput');
  if (!input) return;
  const key = input.value.trim();
  await api.save_license_key(key);
  showLicenseStatus(key ? '✅ Đã lưu' : '✅ Đã xóa key', key ? '#10B981' : '#7a829e');
  setTimeout(() => showLicenseStatus('', '#7a829e'), 2500);
}

function showLicenseStatus(msg, color) {
  const el = document.getElementById('licenseStatus');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color;
}

// ── Card actions ──────────────────────────────────────────────────────────
let entries_cache = [];

async function onInfo(idx) {
  const e = entries_cache[idx];
  if (!e) return;
  if (e.guide_video_url) {
    openUrl(e.guide_video_url);
  } else if (e.guide_tab !== undefined && e.guide_tab !== null) {
    switchTab(e.guide_tab);
    showGuide();
  } else {
    setStatus(idx, e.info, '#7a829e');
    setTimeout(() => setStatus(idx, '', '#7a829e'), 3000);
  }
}

async function onAction(idx) {
  const e = entries_cache[idx];
  if (!e) return;

  if (e.download_url && !e.has_file) {
    await startDownload(idx, e);
  } else {
    const result = await api.launch(idx);
    if (result.ok) {
      setStatus(idx, result.msg, '#10B981');
    } else {
      setStatus(idx, result.msg, '#EF4444');
    }
  }
}

async function startDownload(idx, e) {
  const btn = document.getElementById('btn-action-' + idx);
  btn.className = 'btn-action busy';
  btn.textContent = '⏳  Đang tải...';
  btn.disabled = true;

  setStatus(idx, '⬇️  Đang kết nối Google Drive...', '#8B5CF6');

  // Poll progress từ backend
  const pollId = setInterval(async () => {
    const prog = await api.get_download_progress(idx);
    if (prog) {
      setStatus(idx, prog, '#8B5CF6');
      // Hiện % trên nút nếu có
      const pctMatch = prog.match(/(\d+)%/);
      if (pctMatch) btn.textContent = `⬇  ${pctMatch[1]}%`;
    }
  }, 400);

  const result = await api.download(idx);
  clearInterval(pollId);

  if (result.ok) {
    entries_cache[idx].has_file = true;
    btn.className = 'btn-action launch';
    btn.textContent = '▶  Mở App';
    btn.disabled = false;
    btn.onclick = () => onAction(idx);
    setStatus(idx, '✅  Tải & giải nén xong!', '#10B981');
    // Reload grid để hiển thị V2 trong App chính nếu đang ở Expert mode
    reloadGrid();
  } else {
    btn.className = 'btn-action download';
    btn.textContent = '⬇  Tải về';
    btn.disabled = false;
    setStatus(idx, '❌  ' + result.msg, '#EF4444');
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────
function setStatus(idx, msg, color) {
  const el = document.getElementById('status-' + idx);
  if (!el) return;
  el.textContent = msg;
  el.style.color = color;
}

// ── Fix FFmpeg ────────────────────────────────────────────────────────────
async function fixFfmpeg() {
  const btn = document.getElementById('btnFfmpeg');
  btn.textContent = '⏳ Đang xử lý...';
  btn.disabled = true;
  const result = await api.fix_ffmpeg();
  btn.disabled = false;
  if (result.ok) {
    btn.textContent = '✅ FFmpeg OK';
    btn.classList.add('done');
  } else {
    btn.textContent = '❌ Thất bại';
    btn.classList.add('error');
  }
  setTimeout(() => {
    btn.textContent = '🔧 Fix FFmpeg';
    btn.className = 'btn-ffmpeg';
  }, 3000);
}

// ── Guide Modal ───────────────────────────────────────────────────────────
function showGuide() {
  document.getElementById('guideOverlay').classList.add('open');
}
function closeGuide() {
  document.getElementById('guideOverlay').classList.remove('open');
}

function switchTab(idx) {
  document.querySelectorAll('.guide-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
  document.querySelectorAll('.guide-panel').forEach((p, i) => p.classList.toggle('active', i === idx));
}
// Đóng bằng phím Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeGuide();
  }
});

// ── Notice Popup ──────────────────────────────────────────────────────────
const NOTICE_SKIP_KEY  = 'notice_skip_until';
const NOTICE_48H       = 48 * 60 * 60 * 1000;

function dismissNotice(skip48h) {
  if (skip48h) localStorage.setItem(NOTICE_SKIP_KEY, Date.now() + NOTICE_48H);
  document.getElementById('noticeOverlay').classList.remove('open');
  switchTab(0);
  showGuide();
}

function renderNoticeContent(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const lines = text.split('\n');
  let html = '';
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { html += '<div style="height:6px"></div>'; continue; }
    // Convert URLs thành link clickable
    const linked = line.replace(urlRegex, (url) =>
      `<a href="#" class="notice-link" onclick="openUrl('${url}');return false;">${url}</a>`
    );
    if (line.startsWith('#')) {
      html += `<div class="n-heading">${linked.replace(/^#+\s*/, '')}</div>`;
    } else if (line.startsWith('⚠') || line.startsWith('!')) {
      html += `<div class="n-line n-warn">${linked}</div>`;
    } else {
      html += `<div class="n-line">${linked}</div>`;
    }
  }
  return html;
}

function openUrl(url) {
  api.launch_url(url);
}

async function initNotice() {
  // Đã tắt popup thông báo khi vào app theo yêu cầu.
  return;
}

// ── Boot ──────────────────────────────────────────────────────────────────
async function reloadGrid() {
  entries_cache = await api.get_entries(expertMode);
  const toolsCount = document.getElementById('toolsCount');
  if (toolsCount) toolsCount.textContent = entries_cache.length + ' công cụ';

  const grid = document.getElementById('cardsGrid');
  grid.innerHTML = '';

  const mainEntries = entries_cache.map((e,i)=>({e,i})).filter(({e})=>e.step==='main');
  const subEntries  = entries_cache.map((e,i)=>({e,i})).filter(({e})=>e.step!=='main');

  if (mainEntries.length) {
    const h = document.createElement('div');
    h.className = 'step-header';
    h.innerHTML = '<span class="step-badge step-badge-main">App chính</span>';
    h.style.gridColumn = '1 / -1';
    grid.appendChild(h);

    mainEntries.forEach(({ e, i }) => {
      const card = makeCard(e, i);
      card.classList.add('card-main');
      grid.appendChild(card);
    });
  }

  if (subEntries.length) {
    const hSub = document.createElement('div');
    hSub.className = 'step-header';
    hSub.innerHTML = '<span class="step-badge step-badge-sub">App hỗ trợ</span>';
    hSub.style.gridColumn = '1 / -1';
    grid.appendChild(hSub);

    const steps = {};
    subEntries.forEach(({e,i}) => {
      const s = e.step || 0;
      if (!steps[s]) steps[s] = [];
      steps[s].push({e,i});
    });

    const stepKeys = Object.keys(steps).sort((a,b)=>a-b);
    stepKeys.forEach((s, index) => {
      if (index === 0) {
        const sh = document.createElement('div');
        sh.className = 'step-header step-header-sub';
        sh.innerHTML = '<span class="step-sub-title">Sử dụng 1 trong các công cụ phân cảnh sau</span>';
        sh.style.gridColumn = '1 / -1';
        grid.appendChild(sh);
      }
      steps[s].forEach(({e,i}) => {
        const card = makeCard(e,i);
        card.classList.add('card-sub');
        grid.appendChild(card);
      });
    });
  }
}

async function bootWithApi(selectedApi) {
  if (_booted) return;
  _booted = true;
  api = selectedApi;
  try {
    const licKey = await api.get_license_key();
    const licInput = document.getElementById('licenseInput');
    if (licInput) licInput.value = licKey;
    await reloadGrid();
    initNotice();
  } catch (err) {
    console.error('Boot error:', err);
    document.getElementById('cardsGrid').innerHTML =
      `<div style="color:#EF4444;padding:20px;grid-column:1/-1">❌ Lỗi khởi động: ${err}</div>`;
  }
}

window.addEventListener('pywebviewready', () => {
  if (window.pywebview?.api) bootWithApi(window.pywebview.api);
});

window.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  if (window.pywebview?.api) {
    bootWithApi(window.pywebview.api);
  } else {
    bootWithApi(createBrowserApi());
  }
});

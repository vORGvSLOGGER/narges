// إدارة الوضع الداكن/الفاتح — الافتراضي داكن (يُهيّأ في index.html قبل العرض).
export function isDark() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

export function setDark(next) {
  document.documentElement.classList.toggle('dark', next);
  try { localStorage.setItem('narges-theme', next ? 'dark' : 'light'); } catch { /* تجاهل */ }
}

export function toggleDark() {
  const next = !isDark();
  setDark(next);
  return next;
}

// Preserve an optional territory filter while switching color themes.
for (const link of document.querySelectorAll('[data-switch-theme]')) {
  if (location.search && link.href) {
    const next = new URL(link.href, location.href);
    next.search = location.search;
    link.href = next.href;
  }
}

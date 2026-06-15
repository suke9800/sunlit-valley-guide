const toast = document.querySelector(".toast");
const pageButtons = Array.from(document.querySelectorAll("[data-page-button]"));
const pages = Array.from(document.querySelectorAll("[data-page]"));
const themeToggle = document.querySelector(".theme-toggle");
const themeState = document.querySelector(".theme-toggle-state");
const themeMeta = document.querySelector('meta[name="theme-color"]');
let toastTimer = null;

function applyTheme(theme) {
  const isDark = theme === "dark";

  if (isDark) {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }

  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "다크 모드 끄기" : "다크 모드 켜기");

  if (themeState) {
    themeState.textContent = isDark ? "활성화" : "비활성화";
  }

  themeMeta?.setAttribute("content", isDark ? "#0f1916" : "#1f5d44");
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem("bentadew-theme", theme);
  } catch {}
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("서버 주소를 복사했습니다.");
  } catch {
    showToast(value);
  }
}

function selectPage(pageName, shouldScroll = true) {
  const targetPage = pages.find((page) => page.dataset.page === pageName);
  if (!targetPage) return;

  pages.forEach((page) => {
    const isTarget = page === targetPage;
    page.classList.toggle("is-active", isTarget);
    page.hidden = !isTarget;
  });

  pageButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.pageButton === pageName);
  });

  history.replaceState(null, "", `#${pageName}`);

  if (shouldScroll) {
    document.querySelector(".guide-shell")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    copyText(button.getAttribute("data-copy"));
  });
});

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectPage(button.dataset.pageButton);
  });
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setStoredTheme(nextTheme);
  applyTheme(nextTheme);
});

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const initialPage = window.location.hash.replace("#", "") || "install";
selectPage(initialPage, false);

const accessibilityButton = document.getElementById("accessibilityButton");
const accessibilityPanel = document.getElementById("accessibilityPanel");

const decreaseFont = document.getElementById("decreaseFont");
const resetFont = document.getElementById("resetFont");
const increaseFont = document.getElementById("increaseFont");
const contrastButton = document.getElementById("contrastButton");

accessibilityButton.addEventListener("click", () => {
    accessibilityPanel.hidden = !accessibilityPanel.hidden;
    accessibilityButton.setAttribute("aria-expanded", String(!accessibilityPanel.hidden));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !accessibilityPanel.hidden) {
        accessibilityPanel.hidden = true;
        accessibilityButton.setAttribute("aria-expanded", "false");
        accessibilityButton.focus();
    }
});

let textSize = 100;
let highContrast = false;
const preferencesKey = "acesso-preferencias";
const pageParameters = new URLSearchParams(location.search);
const pageLinks = document.querySelectorAll('a[href$=".html"]');

// Arquivos abertos direto da pasta passam as preferências pelos links.
let sharedStorage = null;
if (location.protocol !== "file:") {
    try {
        sharedStorage = window.localStorage;
    } catch {
        // O navegador pode bloquear o armazenamento.
    }
}

function applyPreferences() {
    document.documentElement.style.fontSize = textSize + "%";
    document.body.classList.toggle("high-contrast", highContrast);
    contrastButton.setAttribute("aria-pressed", String(highContrast));

    if (!sharedStorage) {
        for (const link of pageLinks) {
            const destination = new URL(link.href);
            destination.searchParams.delete("texto");
            destination.searchParams.delete("contraste");
            if (textSize !== 100) destination.searchParams.set("texto", textSize);
            if (highContrast) destination.searchParams.set("contraste", "1");
            link.href = destination.href;
        }
    }
}

function loadPreferences() {
    let preferences = history.state?.accessibility;
    if (sharedStorage) {
        try {
            preferences = JSON.parse(sharedStorage.getItem(preferencesKey)) ?? preferences;
        } catch {
            sharedStorage = null;
        }
    }

    const savedSize = Number(preferences?.textSize ?? pageParameters.get("texto"));
    textSize = savedSize >= 75 && savedSize <= 200 ? savedSize : 100;
    highContrast = preferences?.highContrast ?? (pageParameters.get("contraste") === "1");
    applyPreferences();
}

function savePreferences() {
    const preferences = { textSize, highContrast };
    if (sharedStorage) {
        try {
            sharedStorage.setItem(preferencesKey, JSON.stringify(preferences));
        } catch {
            sharedStorage = null;
        }
    }
    if (!sharedStorage) {
        history.replaceState({ ...history.state, accessibility: preferences }, "");
    }
    applyPreferences();
}

function setTextSize(size) {
    textSize = Math.max(75, Math.min(200, size));
    savePreferences();
}

decreaseFont.addEventListener("click", () => {
    setTextSize(textSize - 12.5);
});

resetFont.addEventListener("click", () => {
    setTextSize(100);
});

increaseFont.addEventListener("click", () => {
    setTextSize(textSize + 12.5);
});

contrastButton.addEventListener("click", () => {
    highContrast = !highContrast;
    savePreferences();
});

loadPreferences();
window.addEventListener("pageshow", loadPreferences);
window.addEventListener("storage", (event) => {
    if (event.key === preferencesKey) loadPreferences();
});

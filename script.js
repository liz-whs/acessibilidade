const accessibilityButton =
    document.getElementById("accessibilityButton");

const accessibilityPanel =
    document.getElementById("accessibilityPanel");

accessibilityButton.addEventListener("click", () => {
    const isOpen =
        accessibilityButton.getAttribute("aria-expanded") === "true";
    accessibilityButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );
    accessibilityPanel.hidden = isOpen;
});

let fontSize = 16;

const increaseFont =
    document.getElementById("increaseFont");

const decreaseFont =
    document.getElementById("decreaseFont");

const resetFont =
    document.getElementById("resetFont");
increaseFont.addEventListener("click", () => {
    if (fontSize < 22) {
        fontSize += 2;
        document.documentElement.style.fontSize =
            `${fontSize}px`;
    }
});

decreaseFont.addEventListener("click", () => {
    if (fontSize > 12) {
        fontSize -= 2;
        document.documentElement.style.fontSize =
            `${fontSize}px`;
    }
});

resetFont.addEventListener("click", () => {
    fontSize = 16;
    document.documentElement.style.fontSize =
        "16px";
});

const contrastButton =
    document.getElementById("contrastButton");
contrastButton.addEventListener("click", () => {
    document.body.classList.toggle("high-contrast");

});

const motionButton =
    document.getElementById("motionButton");
motionButton.addEventListener("click", () => {
    document.body.classList.toggle("reduce-motion");

});
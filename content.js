const aiHelpButtonURL = chrome.runtime.getURL("assets/aiHelpButton.png")

window.addEventListener("load", addAiHelpButton)

function addAiHelpButton() {
    const aiHelpButton = document.createElement('button');
    aiHelpButton.type = "button";
    aiHelpButton.style.cursor = 'pointer';
    aiHelpButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_light_button__ZDAR_ coding_ai_help_button__Custom gap-1 py-2 px-3 overflow-hidden";
    aiHelpButton.style.height = "fit-content";

    // Adding the inner HTML for the button with a robot-style logo
    aiHelpButton.innerHTML = `
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <!-- Robot head logo -->
            <rect x="6" y="8" width="12" height="8" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"></rect>
            <circle cx="9" cy="12" r="1" fill="currentColor"></circle>
            <circle cx="15" cy="12" r="1" fill="currentColor"></circle>
            <path d="M9 16h6" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M8 6h2v2H8zM14 6h2v2h-2z" fill="currentColor"></path>
            <line x1="6" y1="6" x2="8" y2="6" stroke-linecap="round" stroke-linejoin="round"></line>
            <line x1="16" y1="6" x2="18" y2="6" stroke-linecap="round" stroke-linejoin="round"></line>
        </svg>
        <span class="coding_ai_help_gradient_text__Custom">Ask AI</span>
    `;

    // Find the "Ask Doubt" button and insert the new button after it
    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    if (askDoubtButton) {
        askDoubtButton.parentNode.insertAdjacentElement("afterend", aiHelpButton);
    }
}



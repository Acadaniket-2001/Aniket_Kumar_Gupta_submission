const COLORS = {
    "AZ_Blue" : "#ddf6ff",
	"darkBlue" : "#053E55", 
	"blue" : "#05445E",
	"lightBlue" : "#189AB4",
	"darkGreen": "#47C0C7",
	"Green": "#75E6DA",
	"lightGreen" : "#A5ECE7",
	"Mint" : "#D4F1F4",
	"LightMint" : "#D8F2F5"
};

let currentPath = window.location.pathname;

const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        
        // Remove existing chatbox if it exists
        const existingChatbox = document.getElementById("aiChatboxWrapper");
        if (existingChatbox) {
            existingChatbox.remove();
        }
    }

    // Check and add the AI Help button if necessary
    addAiHelpButton();
});


observer.observe(document.body, {childList : true, subtree : true});

addAiHelpButton();

function onProblemsPage() {
    const pathName = window.location.pathname;
    return pathName.startsWith('/problems/') && pathName.length > "/problems/".length;
}

function addAiHelpButton() {
    // Check if the current page is a problems page and the button doesn't already exist
    if (!onProblemsPage() || document.getElementById("aiHelpButton")) return;

    //create AI Help Button Dynamically
    const aiHelpButton = document.createElement('button');
    aiHelpButton.id = "aiHelpButton";
    aiHelpButton.type = "button";
    aiHelpButton.style.cursor = 'pointer';
    aiHelpButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_light_button__ZDAR_ coding_ai_help_button__Custom gap-1 py-2 px-3 overflow-hidden";
    aiHelpButton.style.height = "fit-content";
    aiHelpButton.innerHTML = `<span class="coding_ai_help_gradient_text__Custom">AI Help</span>`;

    // inserting the created button at the required location
    const codingDescContainer = document.getElementsByClassName('py-4 px-3 coding_desc_container__gdB9M')[0];
    if (codingDescContainer) {
        codingDescContainer.insertAdjacentElement("beforeEnd", aiHelpButton);
    }

    // Add click event listener to the AI Help button
    aiHelpButton.addEventListener("click", addaiHelperHandler);
}

function getLocalStorageKey() {
    try {
        // Extract the problem ID from the current path
        const pathSegments = currentPath.split('/');
        const problemIdIndex = pathSegments.indexOf('problems') + 1;
        const problemId = pathSegments[problemIdIndex];

        if (!problemId) {
            throw new Error("Problem ID not found in the URL");
        }

        // Generate a unique key for localStorage
        const uniqueKey = `maang_problem_${problemId}`;
        return uniqueKey;
    } catch (error) {
        console.error("Error generating key:", error.message);
        return null;
    }
}

function addaiHelperHandler() {
    if (document.getElementById("aiChatboxWrapper")) {
        console.log("Chatbox already exists!");
        return;
    }

    const aiHelpButton = document.getElementById("aiHelpButton");
    if (!aiHelpButton) {
        console.error("AI Help button not found!");
        return;
    }

    const parentDiv = aiHelpButton.parentElement;

    const chatboxWrapper = document.createElement('div');
    chatboxWrapper.id = "aiChatboxWrapper";
    chatboxWrapper.style.padding = "16px";

    const chatboxContainer = document.createElement('div');
    chatboxContainer.id = "aiChatbox";
    chatboxContainer.style.width = "100%";
    chatboxContainer.style.backgroundColor = COLORS.Mint;
    chatboxContainer.style.border = `1px solid ${COLORS.lightBlue}`;
    chatboxContainer.style.borderRadius = "8px";
    chatboxContainer.style.display = "flex";
    chatboxContainer.style.flexDirection = "column";

    const chatboxHeader = document.createElement('div');
    chatboxHeader.style.backgroundColor = COLORS.blue;
    chatboxHeader.style.color = "white";
    chatboxHeader.style.padding = "10px";
    chatboxHeader.style.borderTopLeftRadius = "8px";
    chatboxHeader.style.borderTopRightRadius = "8px";
    chatboxHeader.style.display = "flex";
    chatboxHeader.style.justifyContent = "space-between";
    chatboxHeader.style.alignItems = "center";

    chatboxHeader.innerHTML = `
        <span style="font-size: 16px; font-weight: bold;">AI Chat</span>
        <button id="closeChatbox" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">&times;</button>
    `;

    const chatboxBody = document.createElement('div');
    chatboxBody.style.flex = "1";
    chatboxBody.style.overflowY = "auto";
    chatboxBody.style.padding = "10px";
    chatboxBody.style.backgroundColor = "white";
    chatboxBody.style.maxHeight = "300px";
    chatboxBody.style.minHeight = "100px";

    // Populate chatbox with saved chats
    const localDBkey = getLocalStorageKey();
    if (localDBkey) {
        const savedChats = JSON.parse(localStorage.getItem(localDBkey) || "[]");
        savedChats.forEach((chat) => {
            const messageDiv = document.createElement('div');
            messageDiv.style.marginBottom = "10px";
            messageDiv.style.padding = "10px";
            messageDiv.style.borderRadius = "8px";
            messageDiv.style.alignSelf = chat.sender === "user" ? "flex-end" : "flex-start";
            messageDiv.style.backgroundColor = chat.sender === "user" ? COLORS.AZ_Blue : COLORS.lightGreen;
            messageDiv.textContent = chat.message;
            chatboxBody.appendChild(messageDiv);
        });
    }

    const chatboxInputContainer = document.createElement('div');
    chatboxInputContainer.style.padding = "10px";
    chatboxInputContainer.style.borderTop = `1px solid ${COLORS.lightBlue}`;
    chatboxInputContainer.style.backgroundColor = COLORS.AZ_Blue;

    const chatboxInput = document.createElement('input');
    chatboxInput.type = "text";
    chatboxInput.placeholder = "Type your message";
    chatboxInput.style.width = "100%";
    chatboxInput.style.padding = "8px";
    chatboxInput.style.border = `1px solid ${COLORS.lightBlue}`;
    chatboxInput.style.borderRadius = "4px";

    chatboxInputContainer.appendChild(chatboxInput);
    chatboxContainer.appendChild(chatboxHeader);
    chatboxContainer.appendChild(chatboxBody);
    chatboxContainer.appendChild(chatboxInputContainer);
    chatboxWrapper.appendChild(chatboxContainer);
    parentDiv.insertAdjacentElement("afterend", chatboxWrapper);

    chatboxWrapper.scrollIntoView({ behavior: "smooth", block: "center" });

    document.getElementById("closeChatbox").addEventListener("click", () => {
        chatboxWrapper.remove();
    });

    chatboxInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && chatboxInput.value.trim()) {
            const message = chatboxInput.value.trim();
            chatboxInput.value = "";

            const userMessage = document.createElement('div');
            userMessage.style.marginBottom = "10px";
            userMessage.style.padding = "10px";
            userMessage.style.backgroundColor = COLORS.AZ_Blue;
            userMessage.style.color = "black";
            userMessage.style.borderRadius = "8px";
            userMessage.style.alignSelf = "flex-end";
            userMessage.textContent = message;
            chatboxBody.appendChild(userMessage);

            const savedChats = JSON.parse(localStorage.getItem(localDBkey) || "[]");
            savedChats.push({ sender: "user", message });
            localStorage.setItem(localDBkey, JSON.stringify(savedChats));

            fetchGeminiResponse(message).then((response) => {
                const botMessage = document.createElement('div');
                botMessage.style.marginBottom = "10px";
                botMessage.style.padding = "10px";
                botMessage.style.backgroundColor = COLORS.lightGreen;
                botMessage.style.borderRadius = "8px";
                botMessage.style.alignSelf = "flex-start";
                botMessage.textContent = response;
                chatboxBody.appendChild(botMessage);

                savedChats.push({ sender: "bot", message: response });
                localStorage.setItem(localDBkey, JSON.stringify(savedChats));

                chatboxBody.scrollTop = chatboxBody.scrollHeight;
            });
        }
    });
}

// Function to fetch response from Gemini API
async function fetchGeminiResponse(message) {
    const apiKey = "AIzaSyApes88r557-1MqpTmYfg1rzqV5s1iu6ZI"; // Replace with your actual Gemini API key
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"; // Gemini API endpoint

    try {
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: message,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            return data.candidates[0].content.parts[0].text.trim(); // Extracting the response text
        } else {
            throw new Error("Invalid response structure");
        }
    } catch (error) {
        console.error("Failed to fetch response:", error);
        return "Sorry, something went wrong. Please try again later.😢";
    }
}
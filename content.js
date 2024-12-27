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

const observer = new MutationObserver(() => {
    addAiHelpButton();
    console.log("Trigerring");
})

observer.observe(document.body, {childList : true, subtree : true});

addAiHelpButton();

function onProblemsPage() {
    const pathName = window.location.pathname;
    return pathName.startsWith('/problems/') && pathName.length > "/problems/".length;
}

function addAiHelpButton() {
    // Check if the current page is a problems page and the button doesn't already exist
    if (!onProblemsPage() || document.getElementById("aiHelpButton")) return;

    //create AI Help ButtonDynamically
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

function addaiHelperHandler() {
    // Check if chatbox already exists
    if (document.getElementById("aiChatboxWrapper")) {
        console.log("Chatbox already exists!");
        return;
    }

    // Get the AI Help button container
    const aiHelpButton = document.getElementById("aiHelpButton");
    if (!aiHelpButton) {
        console.error("AI Help button not found!");
        return;
    }

    const parentDiv = aiHelpButton.parentElement;

    // Create the wrapper for the chatbox
    const chatboxWrapper = document.createElement('div');
    chatboxWrapper.id = "aiChatboxWrapper";
    chatboxWrapper.style.padding = "16px";

    // Create the chatbox container
    const chatboxContainer = document.createElement('div');
    chatboxContainer.id = "aiChatbox";
    chatboxContainer.style.width = "100%";
    chatboxContainer.style.backgroundColor = COLORS.Mint;
    chatboxContainer.style.border = `1px solid ${COLORS.lightBlue}`;
    chatboxContainer.style.borderRadius = "8px";
    chatboxContainer.style.display = "flex";
    chatboxContainer.style.flexDirection = "column";

    // Create the header for the chatbox
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

    // Create the chatbox body
    const chatboxBody = document.createElement('div');
    chatboxBody.style.flex = "1";
    chatboxBody.style.overflowY = "auto";
    chatboxBody.style.padding = "10px";
    chatboxBody.style.backgroundColor = "white";
    chatboxBody.style.maxHeight = "300px"; 
    chatboxBody.style.minHeight = "100px"; // Optional: ensure minimum height in case there's not enough content

    // Create the input area
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

    // Append input to the input container
    chatboxInputContainer.appendChild(chatboxInput);

    // Append header, body, and input to the chatbox container
    chatboxContainer.appendChild(chatboxHeader);
    chatboxContainer.appendChild(chatboxBody);
    chatboxContainer.appendChild(chatboxInputContainer);

    // Append chatbox container to the wrapper
    chatboxWrapper.appendChild(chatboxContainer);

    // Insert the wrapper directly below the AI Help button
    parentDiv.insertAdjacentElement("afterend", chatboxWrapper);

    // Focus the screen on the newly created chatbox (added feature)
    chatboxWrapper.scrollIntoView({ behavior: "smooth", block: "center" }); // This will scroll the page to bring the chatbox into view.

    // Event listener to close the chatbox
    document.getElementById("closeChatbox").addEventListener("click", () => {
        chatboxWrapper.remove();
    });

    // Event listener to send messages
    chatboxInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && chatboxInput.value.trim()) {
            const message = chatboxInput.value.trim();
            chatboxInput.value = "";

            // Display the user's message in the chatbox              
            const userMessage = document.createElement('div');
            userMessage.style.marginBottom = "10px";
            userMessage.style.padding = "10px";
            userMessage.style.backgroundColor = COLORS.AZ_Blue;
            userMessage.style.color = "black";
            userMessage.style.borderRadius = "8px";
            userMessage.style.alignSelf = "flex-end";
            userMessage.textContent = message;

            chatboxBody.appendChild(userMessage);

            // Call Gemini API and display the response
            fetchGeminiResponse(message).then((response) => {
                const botMessage = document.createElement('div');
                botMessage.style.marginBottom = "10px";
                botMessage.style.padding = "10px";
                botMessage.style.backgroundColor = COLORS.lightGreen;
                botMessage.style.borderRadius = "8px";
                botMessage.style.alignSelf = "flex-start";
                botMessage.textContent = response;

                chatboxBody.appendChild(botMessage);

                // Scroll to the bottom of the chatbox
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

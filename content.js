const COLORS = {
    "AZ_Blue" : "#ddf6ff",
	"blue" : "#05445E",
	"lightBlue" : "#189AB4",
	"Green": "#75E6DA",
	"lightGreen" : "#A5ECE7",
	"Mint" : "#D4F1F4"
};

let  MY_API_KEY = "";




function getAPIKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get("apiKey", (data) => {
            if (data.apiKey) {
                MY_API_KEY = data.apiKey;
                resolve(data.apiKey);
            } else {
                reject("API Key not set!");
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
    getAPIKey()
        .then((key) => console.log("API Key Loaded:", key))
        .catch((error) => console.error("Failed to load API Key:", error));
});




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
    
    if(document.body)   addInjectScript();
    
    // Check and add the AI Help button if necessary
    addAiHelpButton();
});
observer.observe(document.body, {childList : true, subtree : true});
addAiHelpButton();




function addInjectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    script.onload = () => script.remove();
    document.documentElement.appendChild(script);
}
addInjectScript();




const problemDataMap = new Map();
let lastPageVisited = "";
window.addEventListener("xhrDataFetched", (event) => {
    const data = event.detail;
    // console.log("Data fetched from CustomEvent: ", data);
    if(data.url && data.url.match(/https:\/\/api2\.maang\.in\/problems\/user\/\d+/)) {

        // console.log(data.url)
        
        const idMatch = data.url.match(/\/(\d+)$/);
        
        // console.log(idMatch);
        
        if(idMatch) {
            const id = idMatch[1];
        
            // console.log(idMatch[1]);
            
            console.log("Storing problem data with ID:", id);
            problemDataMap.set(id, data.response);   // storing response data by id
            // console.log(`Stored Data for probelm ID ${id}: `, data.response);
        }
    }
});




function getCurrentProblemId() {
    const idMatch = window.location.pathname.match(/-(\d+)$/);
    return idMatch ? idMatch[1] : null;
}


function getProblemDataById(id) {
    console.log("Fetching problem data with ID:", id);
    if(id && problemDataMap.has(id)) {
        // console.log(problemDataMap.get(id));
        return problemDataMap.get(id);
    }
    console.log(`No data found for the problem ID ${id}`);
    return null;
}

function getLocalStorageValueById(id) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); 
        
        const lang = getCodingLangauge();
        
        if (key.endsWith(`${id}_${lang}`)) { 
            return localStorage.getItem(key);
        }
    }
    return null;
}

function getCodingLangauge() {
    const langElements = document.getElementsByClassName("d-flex align-items-center gap-1 text-blue-dark");

    let lang = "";
    if (langElements.length) {
        lang = langElements[0].textContent.trim();
        console.log(lang);
    }
    else {
        console.log("Element not found");
    }
    return lang;
}




function onProblemsPage() {
    const pathName = window.location.pathname;
    return pathName.startsWith('/problems/') && pathName.length > "/problems/".length;
}




function getProblemDescription() {
    const elements = document.getElementsByClassName("problem_paragraph");

    let contentString = "";

    for (let i = 8; i <= 11; i++) {
        if (elements[i]) {
            contentString += elements[i].textContent.trim() + "\n\n";
        }
    }

    contentString = contentString.trim();
    console.log(contentString);
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




// Update the chatbox population to use chrome.storage.sync
async function addaiHelperHandler() {
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

    // Populate chatbox with saved chats from chrome.storage.local
    const problemKey = getCurrentProblemId();
    if (problemKey) {
        try {
            const savedChats = await getChatHistory(problemKey);
            savedChats.forEach((message) => {
                const messageDiv = document.createElement('div');
                messageDiv.style.marginBottom = "10px";
                messageDiv.style.padding = "10px";
                messageDiv.style.borderRadius = "8px";
                messageDiv.style.alignSelf = message.role === "user" ? "flex-end" : "flex-start";
                messageDiv.style.backgroundColor = message.role === "user" ? COLORS.AZ_Blue : COLORS.lightGreen;
                messageDiv.textContent = message.parts[0].text;
                chatboxBody.appendChild(messageDiv);
            });
        } catch (error) {
            console.error("Failed to load chat history:", error);
        }
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

            fetchGeminiResponse(message).then((response) => {
                const botMessage = document.createElement('div');
                botMessage.style.marginBottom = "10px";
                botMessage.style.padding = "10px";
                botMessage.style.backgroundColor = COLORS.lightGreen;
                botMessage.style.borderRadius = "8px";
                botMessage.style.alignSelf = "flex-start";
                botMessage.textContent = response;
                chatboxBody.appendChild(botMessage);

                chatboxBody.scrollTop = chatboxBody.scrollHeight;
            });
        }
    });
}




// Utility function to get chat history from chrome storage
function getChatHistory(problemKey) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(problemKey, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[problemKey] || []);
            }
        });
    });
}

// Utility function to save chat history to chrome storage
function saveChatHistory(problemKey, chatHistory) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [problemKey]: chatHistory }, () => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

async function fetchGeminiResponse(userMessage) {
    if (!MY_API_KEY) {
        try {
            await getAPIKey(); // Fetch and set the API key if not already set
        } catch (error) {
            console.error(error);
            return "API Key is not set. Please configure it in the popup.";
        }
    }

    const apiKey = MY_API_KEY; // Your actual Gemini API key
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"; // Gemini API endpoint

    try {
        const problemKey = getCurrentProblemId();
        // Retrieve existing chat history for the problem from chrome.storage.sync
        let chatHistory = await getChatHistory(problemKey);

        // if(chatHistory.length === 0) {
        //     // If chat history is empty, build the initial prompt
        //     const initialPrompt = await buildInitialPrompt(userMessage);

        //     chatHistory = [
        //         {
        //             role: "user",
        //             parts: [
        //                 {text : initialPrompt}
        //             ]
        //         }
        //     ];
        // }   
        // else {
            // Add the user message to the chat history
            chatHistory.push({
                role: "user",
                parts: [{ text: userMessage }]
            });
        // }

        const payLoad = { contents: chatHistory };

        // Make the API call with the chat history
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payLoad)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the model's response
        const modelResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!modelResponse) {
            throw new Error("Invalid response structure");
        }

        // Add the model's response to the chat history
        chatHistory.push({
            role: "model",
            parts: [{ text: modelResponse }]
        });

        // Save updated chat history back to chrome.storage.sync
        await saveChatHistory(problemKey, chatHistory);

        return modelResponse;
    } catch (error) {
        console.error("Failed to fetch response:", error);
        return "Sorry, something went wrong. Please try again later. 😢";
    }
}

async function buildInitialPrompt(userMessage) {
    const problemId = getCurrentProblemId();

    const problemData = getProblemDataById(problemId);
    const currentCode = getLocalStorageValueById(problemId);

    console.log(problemId);
    console.log(problemData);
    console.log(currentCode);
}

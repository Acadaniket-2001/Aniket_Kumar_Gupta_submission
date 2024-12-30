document.getElementById("apiKeyForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the form from reloading the popup
  
    // Get the API key from the input field
    const apiKey = document.getElementById("apiKey").value;
  
    // Save the API key to Chrome's storage
    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      // Show a success message
      const statusMessage = document.getElementById("statusMessage");
      statusMessage.textContent = "API key saved successfully!";
      statusMessage.style.color = "green";
  
      // Clear the input field
      document.getElementById("apiKey").value = "";
  
      // Optional: Auto-hide the message after 3 seconds
      setTimeout(() => {
        statusMessage.textContent = "";
      }, 3000);
    });
  });
  
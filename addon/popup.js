let triggerButton = document.getElementById("getEmailTemplate");

triggerButton.addEventListener("click", () => {
    // Display a loading message
    const statusDiv = document.getElementById("status");
    statusDiv.innerHTML = "Extracting and saving template...";
  
    // Query the active tab and execute the script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractEmailTemplate, // Function to run in the tab
        },
        async (results) => {
          // Get the extracted data
          const extractedData = results[0]?.result;
  
          // Check for errors
          if (extractedData?.error) {
            console.error("Error extracting email template:", extractedData.error);
            statusDiv.innerHTML = `Error: ${extractedData.error}`;
            return;
          }
  
          // Save the template via API
          try {
            const response = await fetch("http://localhost:3001/api/templates", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(extractedData),
            });
  
            if (response.ok) {
              const result = await response.json();
              console.log("Template saved successfully:", result);
              statusDiv.innerHTML = "Template saved successfully!";
            } else {
              const errorData = await response.json();
              console.error("Error saving template:", errorData);
              statusDiv.innerHTML = `Failed to save template: ${errorData.message}`;
            }
            setTimeout(function(){
                statusDiv.innerHTML = "";
            }, 3000)
          } catch (error) {
            console.error("Error occurred while saving the template:", error);
            statusDiv.innerHTML = "An error occurred while saving the template.";
          }
        }
      );
    });
  });
  
  // Function to extract the email template from the page
  function extractEmailTemplate() {
    try {
      // Extract basic page information
      const pageTitle = document.title || "No Title";
      const pageDesc =
        document.head.querySelector("meta[name=description]")?.getAttribute("content") || "No Description";
      const brandName = pageTitle.split("|")[0].split(":")[0]?.trim() || "Unknown Brand";
      const emailTitle = pageTitle.split("|")[0].split(":")[1]?.trim() || "No Title";
  
      // Access Shadow DOM to extract email content
      const emailBody = document.body.querySelector("#emailcell")?.shadowRoot;
      if (!emailBody) {
        throw new Error("Shadow root not found");
      }
  
      const emailContent = emailBody.querySelector("#milled-emaildiv")?.innerHTML || "";
      const brandThumb = emailBody.querySelector("#milled-emaildiv")?.querySelectorAll("img")[0]?.getAttribute("src") || "";

      if (!emailContent) {
        throw new Error("Email content not found in shadow DOM");
      }
      let dateTime = document.querySelector('div[data-controller="message"]').querySelectorAll("time")[0].textContent;
      if(dateTime == "" || dateTime == undefined || dateTime == null){
        dateTime = new Date().toLocaleDateString("en-US") +" "+ new Date().toLocaleTimeString("en-US");
      }
      // Return the extracted data
      return {
        date: dateTime,
        brand_name: brandName,
        brand_thumb: "N/A", // Placeholder image
        email_title: emailTitle.normalize('NFC'),
        email_description: pageDesc,
        email_body: emailContent,
      };
    } catch (error) {
      console.error("Error extracting email template:", error);
      return { error: error.message };
    }
  }
  
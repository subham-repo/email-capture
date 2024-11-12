// document.getElementById("changeColor").addEventListener("click", () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             func: () => document.body.style.backgroundColor = "lightblue"
//         });
//     });
// });


document.getElementById("getEmailTemplate").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
                let pageInfoHead = document.head;
                let pageTitle = document.title;
                let pageDesc = document.head.querySelector("meta[name=description]").getAttribute("content");
                // document.head.querySelector("meta[property=og:image]").getAttribute("content") 
                let brandThumb = "";
                let date = new Date();
                console.log({date, pageTitle, pageDesc, brandThumb})
                let emailBody = document.body.querySelector(".emailScreen .iframeContainer iframe");
                let emailContent = emailBody.getAttribute("data-srcdoc-html");
                document.body.innerHTML = emailContent
            }
        });
    });
});

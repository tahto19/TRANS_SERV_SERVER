function loadExternalScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://eacomm.com/assets/js/include-chatbot.min.js";
    script.async = true;
    script.onload = () => {
      // Script loaded successfully
      // You can use the functionality provided by the external script here
      //   const originalLog = console.log;

      //   console.log = function(message) {
      //     // console.log("====", message)
      //     // Call the original console.log function
      //     originalLog.apply(console, arguments);
      //     // Trigger an event or resolve a Promise when "Connected" is logged
      //     if (message === 'Connected') {
      //       const event = new CustomEvent('connectedEvent');
      //       document.dispatchEvent(event);
      //     }
      //   };

      //   const observer = new MutationObserver((mutations) => {
      //     mutations.forEach((mutation) => {
      //       mutation.addedNodes.forEach((node) => {
      //         console.log(node.textContent)
      //         if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Connected')) {
      //           observer.disconnect(); // Disconnect the observer once "Connected" appears
      //           resolve(); // Resolve the Promise
      //         }
      //       });
      //     });
      //   });

      //   // Start observing changes in the console
      //   observer.observe(document.querySelector('body'), { childList: true, subtree: true });

      resolve();
    };
    script.onerror = (error) => {
      // Error loading script
      console.error("Error loading script:", error);
      reject(error); // Reject the Promise if there's an error
    };
    document.head.appendChild(script);
  });
}

function inputEmail(email, name) {
  const originalLog = console.log;
  console.log = function (message) {
    originalLog.apply(console, arguments);
    if (message === "Connected") {
      setTimeout(() => {
        const inputElement = document.getElementById("Email");
        if (inputElement) {
          inputElement.value = email;
        }
        inputElement.dispatchEvent(new Event("change"));
      }, 2000);

      const event = new CustomEvent("connectedEvent");
      document.dispatchEvent(event);

      setTimeout(() => {
        const intervalId = setInterval(() => {
          const parent = document.getElementById("display-message");
          if (parent.children.length >= 3) {
            // Get the fourth child element
            let thirdChild = parent.children[2];

            // Find the specific child div with class 'eacomm-message' inside the third child element
            let childDiv = thirdChild.querySelector(".eacomm-message");
            
            if(!childDiv){
                thirdChild = parent.children[3];
                childDiv = thirdChild.querySelector(".eacomm-message");
            }

            if (
              childDiv &&
              childDiv.textContent.trim() === "How can I help you today?"
            ) {
              clearInterval(intervalId);

              // Change the content of the found child div
              childDiv.textContent = `Hi ${name}, how can I help you today?`;
            }
          }
        }, 1000);
      }, 1000);
    }
  };
}
export { loadExternalScript, inputEmail };

const sendchatbtn = document.querySelector("#send-btn");
const chatinput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chattoggler = document.querySelector(".chatbot-toggler");
const chatbotclosebtn = document.querySelector(".close-btn");
const chatbotclosebtn1 = document.querySelector(".close-btn1");

let usermgs;
const API_KEY = ""; 

// Create chat bubble
const createli = (message, className) => {
  const chatli = document.createElement("li");
  chatli.classList.add("chat", className);
  let chatcontent =
      className === "outgoing"
          ? `<p></p>`
          : `<img src="bot.png" alt="bot"><p></p>`;
  chatli.innerHTML = chatcontent;
  chatli.querySelector("p").textContent = message;
  return chatli;
};

// Generate response from OpenAI
const generateresponse = (incomingchatli) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingchatli.querySelector("p");

  const requestoption = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: usermgs }]
      })
  };

  fetch(API_URL, requestoption)
      .then(res => res.json())
      .then(data => {
          console.log(data);
          messageElement.textContent = data.choices?.[0]?.message?.content || "⚠️ No response";
      })
      .catch((error) => {
          console.error(error);
          messageElement.textContent = "⚠️ Oops! Something went wrong. Please try again.";
      })
      .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
};

// Handle user message
const handlechat = () => {
  usermgs = chatinput.value.trim();
  if (!usermgs) return;

  chatinput.value = "";
  chatbox.appendChild(createli(usermgs, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
      const incomingchatli = createli("Thinking...", "incoming");
      chatbox.appendChild(incomingchatli);
      generateresponse(incomingchatli);
  }, 600);
};

// Event listeners
sendchatbtn.addEventListener("click", handlechat);
chatbotclosebtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotclosebtn1.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chattoggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

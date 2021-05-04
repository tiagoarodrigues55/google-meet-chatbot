// Framework Code
(() => {
	let messagesLength = -1;
	let lastMessageLength = -1;
	let events = {};
	
	window.chatbot = {
		sendMessage: function(...args) {
			let message = document.querySelector("*[name=\"chatTextInput\"]");
			let button = document.querySelector("div > div > div > div > div > div > div[data-is-persistent=\"true\"] > div > div > span > div[data-reverse-order=\"false\"] > div > div[data-tooltip-horizontal-offset=\"0\"]");
			if (message && button) {
				let lastValue = message.value + "";
				message.value = args.join("");

				button.ariaDisabled = null
				button.click();
				
				let success = message.value === "";
				message.value = lastValue;
				
				return success;
			}
			
			return false;
		},
		on: function(event, f) {
			if (!events[event] && typeof(f) == "function")
				events[event] = f
		},
		emit: function(event, ...args) {
			if (events[event])
				events[event](...args);
		}
	}

	if (window.messagesInterval)
		try {
			clearInterval(messagesInterval);
		} catch (err) {}

	window.messagesInterval = setInterval(() => {
		var messages = document.querySelector("* > div > div > div > div > div > div > div[data-is-persistent=\"true\"] > div > div > span > div[data-reverse-order=\"false\"] > div[aria-live=\"polite\"]").childNodes;

		if (messages) {
			if (messages.length > 0)
				var message = messages[messages.length - 1];

			if (messagesLength === -1) {
				messagesLength = messages.length;
				lastMessageLength = message ? message.childNodes[1].childNodes.length : 0;
			} else if (messagesLength != messages.length || (message && lastMessageLength != message.childNodes[1].childNodes.length)) {
				let messageText = message.childNodes[1].childNodes[message.childNodes[1].childNodes.length - 1].dataset.messageText;

				messagesLength = messages.length;
				lastMessageLength = message.childNodes[1].childNodes.length;

				window.chatbot.emit("message", message.dataset.senderName, messageText, parseInt(message.dataset.timestamp));
			}
		}
	}, 100);
})();

// Sample Code
var prefix = '.';
var respostas = []
var blacklist = []
chatbot.on("message", (username, message, date) => {
  if(blacklist.indexOf(message)!==-1){
    return
  }
  console.log(respostas)
  if(respostas.indexOf(message)!==-1){
    respostas.push(message)
  }else{
    if(respostas.length){
      respostas = []
      return
    }
    respostas.push(message)

  }
  if(respostas.length > 1){
    chatbot.sendMessage(message)
    blacklist.push(message)
    respostas = []
  }

});

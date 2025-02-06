const channelID = 'T3qMpB2ufHCrd2zI';
const colors = ['#2196F3', '#32c787', '#F0F8FF', '#FFE4C4', '#008B8B', '#00008B', ''];
const usedNames = new Set();

const drone = new ScaleDrone(channelID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Connected to Scaledrone');
});

const room = drone.subscribe('observable-room');
room.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Connected to room');
});

room.on('data', (text, member) => {
  if (member) {
    addMessage(`${member.clientData.name}: ${text}`, member.clientData.color);
  } else {
    addMessage(text);
  }
});

drone.on('close', event => {
  console.log('Connection closed', event);
});

drone.on('error', error => {
  console.error(error);
});

document.getElementById('send-button').onclick = sendMessage;

document.getElementById('message-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const message = messageInput.value;
  if (message) {
    drone.publish({
      room: 'observable-room',
      message,
    });
    messageInput.value = '';
  }
}

function addMessage(message, color) {
  const chatDisplay = document.getElementById('chat-display');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-bubble');
  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');
  messageContent.appendChild(document.createTextNode(message));
  messageElement.appendChild(messageContent);
  messageElement.style.backgroundColor = color || 'lightblue';
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function getRandomName() {
  const adjectives = ['Autumn', 'Hidden', 'Bitter', 'Misty', 'Silent', 'Empty', 'Dry', 'Dark'];
  const nouns = ['Waterfall', 'River', 'Storm', 'Rain', 'Wind', 'Sea', 'Morning', 'Snow', 'Fire'];

  let name;
  do {
    name = adjectives[Math.floor(Math.random() * adjectives.length)] +
      nouns[Math.floor(Math.random() * nouns.length)];
  } while (usedNames.has(name));

  usedNames.add(name);
  return name;
}

function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
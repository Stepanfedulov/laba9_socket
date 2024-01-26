const socket = io();

const joinContainer = document.getElementById('join-container');
const chatContainer = document.getElementById('chat-container');
const nicknameInput = document.getElementById('nickname');
const colorPicker = document.getElementById('color-picker');
const joinChatButton = document.getElementById('join-chat');
const messageInput = document.getElementById('message-input');
const sendMessageButton = document.getElementById('send-message');
const chatBox = document.getElementById('chat-box');
const userList = document.getElementById('user-list');

joinChatButton.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    const color = colorPicker.value;
    if (!nickname) {
        return alert('Please enter a nickname');
    }

    socket.emit('join', { nickname, color });
    joinContainer.style.display = 'none';
    chatContainer.style.display = 'block';
    joinChatButton.style.display = 'none';
    userList.style.display="block"
});

sendMessageButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    message = messageInput.value.trim().replace(/</gi,'&lt').replace(/>/gi,'&gt');
    if (message) {
        socket.emit('sendMessage', message);
        messageInput.value = '';
    }
}

socket.on('message', ({ user, text, time }) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<span class="nickname" style="color: ${user.color}">${user.nickname}</span><div>${text}</div><div class="time">${new Date(time).toLocaleTimeString()}</div>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('userList', (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.textContent = user.nickname;
        userList.appendChild(userElement);
    });
});

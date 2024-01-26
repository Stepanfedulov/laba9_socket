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
const bottomBox=document.getElementById('bottom-box')
const emojiContainer=document.getElementById("emoji-container");
const emojiButton=document.getElementById('emoji-button')
joinChatButton.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    const color = colorPicker.value;
    if (!nickname) {
        return alert('Please enter a nickname');
    }

    socket.emit('join', { nickname, color });
    joinContainer.style.display = 'none';
    chatContainer.style.display = 'flex';
    joinChatButton.style.display = 'none';
    userList.style.display="flex";
    bottomBox.style.display='flex';
});

sendMessageButton.addEventListener('click', sendMessage);
emojiButton.addEventListener('click',()=>{
    emojiContainer.style.display=emojiContainer.style.display==='none'?'block':'none';})
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
function addEmoji(emoji){
    messageInput.value += emoji;
    emojiContainer.style.display='none';
}
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

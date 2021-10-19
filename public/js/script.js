const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

//Get username from URL
const { username } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
  });

const socket = io();

//Join the chat
socket.emit('joinChat',  username );

//Show users on sidebar
socket.on('users', ({users}) => {
    showUsers(users)
})

//show user message
socket.on('message', message => {
    console.log(message);
    showMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//submit message on send btn click
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //getting the text msg from user
    let msg = e.target.elements.msg.value;

    //emit message to the server
    socket.emit('message', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

const showMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    chatMessages.appendChild(div);
}

//add users to dom
const showUsers = (users) => {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
}





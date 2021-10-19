const users = [];

//User joins the chat
const userJoin = (id, username) => {
    const user = {id, username };
    users.push(user);
    return user;
};

//User leaves the chat
const userLeave = (id) => {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }

}

//get chat users
const getChatUsers = () => {
    return users;
}

//get current user
const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
};

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getChatUsers
};
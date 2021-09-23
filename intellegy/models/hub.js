function User(id, name) {   
    this.id = id
    this.name = name
}

// ID
User.prototype.getId = () => {
    return this.id
}

// Name
User.prototype.getName = () => {
    return this.name
}

User.prototype.setName = (name) => {
    this.name = name
}
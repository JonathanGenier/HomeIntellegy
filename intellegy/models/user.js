function User(id, firstName, lastName, email, country, region, city, address, postalCode, hubList) {   
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.country = country
    this.region = region
    this.city = city
    this.address = address
    this.postalCode = postalCode
    this.hubList = hubList
}

// ID
User.prototype.getId = () => {
    return this.id
}

// First Name
User.prototype.getFirstName = () => {
    return this.firstName
}

User.prototype.setFirstName = (firstName) => {
    this.firstName = firstName
}

// Last Name
User.prototype.getLastName = () => {
    return this.firstName
}

User.prototype.setLastName = (lastName) => {
    this.lastName = lastName
}

// Email
User.prototype.getEmail = () => {
    return this.firstName
}

User.prototype.setEmail = (email) => {
    this.email = email
}

// Country
User.prototype.getCountry = () => {
    return this.country
}

User.prototype.setCountry = (country) => {
    this.country = country
}

// Region
User.prototype.getRegion = () => {
    return this.region
}

User.prototype.setRegion = (region) => {
    this.region = region
}

// City
User.prototype.getCity = () => {
    return this.city
}

User.prototype.setCity = (city) => {
    this.city = city
}

// Address
User.prototype.getAddress = () => {
    return this.address
}

User.prototype.setAddress = (address) => {
    this.address = address
}

// Postal Code
User.prototype.getPostalCode = () => {
    return this.postalCode
}

User.prototype.setPostalCode = (postalCode) => {
    this.postalCode = postalCode
}

// Hub List
User.prototype.getHubList = () => {
    return this.hubList
}

User.prototype.setHubList = (hubList) => {
    this.hubList = hubList
}

module.exports = User;     

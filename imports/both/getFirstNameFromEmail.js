export const getFirstNameFromEmail = email => {
    const name = email.split('.')[0]
    return name[0].toUpperCase() + name.substring(1)
}
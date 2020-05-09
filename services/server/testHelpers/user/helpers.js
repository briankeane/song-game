const faker = require('faker');

async function CreateUser(db, data={}) {
  return await db.models.User.create({
    displayName: data.displayName|| faker.name.firstName(),
    email: data.accessToken || faker.internet.email(),
    profileImageURL: data.profileImageURL || faker.image.imageUrl(),
    role: data.role || 'user'
  });
}

module.exports = {
  CreateUser
};
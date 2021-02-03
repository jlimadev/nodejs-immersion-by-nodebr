const getUser = (name) => {
  return new Promise((resolve, reject) => {
    if (!name) {
      return reject(new Error('You must inform the name'));
    }
    setTimeout(() => {
      return resolve({
        id: 1,
        name,
        age: 600,
      });
    }, 500);
  });
};

const getPhone = (userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject(new Error('You must inform the userId'));
    }

    setTimeout(() => {
      return resolve({
        userId,
        ddd: 11,
        phone: 40028922,
      });
    }, 1000);
  });
};

const getAddress = (userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      return reject(new Error('You must inform the userId'));
    }

    setTimeout(() => {
      return resolve({
        userId,
        street: 'Groove Street',
        number: 100,
      });
    }, 500);
  });
};

getUser('Bomuto')
  .then((user) => {
    return getPhone(user.id).then((phone) => {
      return {
        user: user,
        phone: phone,
      };
    });
  })
  .then((responseObject) => {
    return getAddress(responseObject.user.id).then((address) => {
      return {
        user: responseObject.user,
        phone: responseObject.phone,
        address,
      };
    });
  })
  .then((responseObject) => {
    console.log('Response from promises', responseObject);
  })
  .catch((err) => console.error('OPS!:', err));

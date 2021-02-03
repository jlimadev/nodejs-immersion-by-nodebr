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

const main = async () => {
  try {
    const user = await getUser('Reginaldo Primo');

    const promises = [await getPhone(user.id), await getAddress(user.id)];

    await Promise.all(promises);

    const [phone, address] = promises;

    const returnObject = {
      user,
      phone,
      address,
    };

    console.log(returnObject);
    return returnObject;
  } catch (error) {
    console.error('OPS!', error);
  }
};

main();

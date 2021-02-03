const getUser = (callback) => {
  setTimeout(() => {
    return callback('Error message', {
      id: 1,
      name: 'Reginaldo Rossi',
      age: 600,
    });
  }, 500);
};

const getPhone = (userId, callback) => {
  setTimeout(() => {
    return callback(null, {
      userId,
      ddd: 11,
      phone: 40028922,
    });
  }, 1000);
};

const getAddress = (userId, callback) => {
  setTimeout(() => {
    return callback(null, {
      userId,
      street: 'Groove Street',
      number: 100,
    });
  }, 500);
};

resolveUserCallbackFn = (error, user) => {
  if (!user) {
    console.error('Error on Getting User!', error);
    return;
  }

  const resolvePhoneCallbackFn = (error1, phone) => {
    if (!phone) {
      console.error('Error on Getting Phone!', error1);
      return;
    }

    const resolveAdressCallbackFn = (error2, adress) => {
      if (!adress) {
        console.error('Error on Getting adress!', error2);
        return;
      }

      console.log(user);
      console.log(phone);
      console.log(adress);
    };

    getAddress(user.id, resolveAdressCallbackFn);
  };

  getPhone(user.id, resolvePhoneCallbackFn);
};

getUser(resolveUserCallbackFn);

/* Callback hell */

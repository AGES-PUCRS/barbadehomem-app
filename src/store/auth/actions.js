import {
  RECEIVE_USER,
  RECEIVE_ADDRESS,
  IS_AUTHENTICATED,
} from '../actionTypes';

import { firestore } from '../../plugins/firebase';

export function receiveUser(payload) {
  return {
    type: RECEIVE_USER,
    payload,
  };
}

export function receiveAddress(payload) {
  return {
    type: RECEIVE_ADDRESS,
    payload,
  };
}

export function isAuthenticated(payload) {
  return {
    type: IS_AUTHENTICATED,
    payload,
  };
}

export function fetchUser(id) {
  return async dispatch => {
    const response = (
      await firestore.firestore().collection('users').doc(id).get()
    ).data();

    const user = {
      id,
      name: response.name,
      email: response.email,
      birthday: response.birthday,
      phone: response.phone,
    };

    dispatch(receiveUser(user));
    dispatch(isAuthenticated(true));

    await firestore
      .firestore()
      .collection('users')
      .doc(id)
      .collection('address')
      .get()
      .then(snapshop => {
        snapshop.docs.forEach(doc => {
          const address = {
            id: doc.id,
            city: doc.data().city,
            complement: doc.data().complement,
            district: doc.data().district,
            num: doc.data().num,
            street: doc.data().street,
            uf: doc.data().uf,
          };

          dispatch(receiveAddress(address));
        });
      });
  };
}

/**
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.name
 * @param {string} payload.birthday
 * @param {string} payload.phone
 */
export function registerUser(payload) {
  return async dispatch => {
    const response = await firestore
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password);

    const { password, ...publicData } = payload;

    await firestore
      .firestore()
      .collection('users')
      .doc(response.user.uid)
      .set(publicData);

    dispatch(
      receiveUser({
        id: response.user.uid,
        ...publicData,
      })
    );

    dispatch(isAuthenticated(true));
  };
}

/**
 * @param {object} payload
 * @param {string} payload.street
 * @param {string} payload.num
 * @param {string} payload.complement
 * @param {string} payload.district
 * @param {string} payload.city
 * @param {string} payload.uf
 */
export function registerAddress(payload) {
  return async dispatch => {
    const docRef = await firestore
      .firestore()
      .collection('users')
      .doc(firestore.auth().currentUser.uid)
      .collection('address')
      .add(payload);

    dispatch(receiveAddress({ id: docRef.id, ...payload }));
  };
}

/**
 * @param {string} payload
 */
export async function resetPassword(payload) {
  const email = payload;

  //PÁGINA PARA QUAL O USUÁRIO SERÁ DIRECIONADO APÓS RESETAR A SENHA
  const actionCodeSettings = {
    url: 'http://localhost:3000/',
  };

  return await firestore
    .auth()
    .sendPasswordResetEmail(email, actionCodeSettings);
}

/**
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 */
export function authenticateUser(payload) {
  const { email, password } = payload;

  return async dispatch => {
    const response = await firestore
      .auth()
      .signInWithEmailAndPassword(email, password);
    dispatch(fetchUser(response.user.uid));
  };
}

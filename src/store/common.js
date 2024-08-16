import { atom } from 'recoil';

/**
 * @typedef TMeState
 * @property {String} id
 * @property {String} wallet
 * @property {String} email
 * @property {String} nickname
 * @property {Boolean} isPartner
 */

export const common = () => {
  /** @type {import('recoil').RecoilState<TMeState>} */
  const meState = atom({
    key: 'meState',
    default: null,
  });

  return { meState };
};

import { get as getUser } from '../services/UserService';

const get = async ({ id }) => {
  const user = await getUser({ id });
  return user;
};

export { get };

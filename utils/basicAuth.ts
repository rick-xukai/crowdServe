import initializeBasicAuth from 'nextjs-basic-auth';
import users from '../users';

export default initializeBasicAuth({
  users
});

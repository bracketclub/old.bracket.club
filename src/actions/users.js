import config from 'config';
import restActions from 'lib/restActions';
import {users as schema} from '../schema';

export default restActions({
  schema,
  url: `${config.apiUrl}/users`
});

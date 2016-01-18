import config from 'config';
import restActions from '../lib/restActions';
import {entries as schema} from '../schema';

export default restActions({
  schema,
  url: `${config.apiUrl}/entries`
});

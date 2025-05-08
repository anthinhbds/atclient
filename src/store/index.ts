import { combineReducers } from "redux";
import notify from './notify/reducer';
import autocomplete from './autocomplete/reducer';
import datatable from './datatable/reducer';
import user from './user/reducer';
import project from './project/reducer';
import apartment from './apartment/reducer';
import customer from './customer/reducer';
import customerjourney from './customerjourney/reducer';
import transaction from './transaction/reducer';
import home from './home/reducer';
import report from './report/reducer';

export default combineReducers({
  notify,
  autocomplete,
  datatable,
  user,
  project,
  apartment,
  customer,
  customerjourney,
  transaction,
  home,
  report,
});

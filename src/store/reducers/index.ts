// third-party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// project import
import calendar from './calendar';
import cartReducer from './cart';
import chat from './chat';
import invoice from './invoice';
import kanban from './kanban';
import menu from './menu';
import productReducer from './product';
import snackbar from './snackbar';
import user from './user';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  chat,
  calendar,
  menu,
  snackbar,
  cart: persistReducer(
    {
      key: 'cart',
      storage,
      keyPrefix: 'mantis-ts-'
    },
    cartReducer
  ),
  product: productReducer,
  kanban,
  invoice,
  user
});

export default reducers;

import { createStore } from "redux";
import rootReducer from "../reducers/index";
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage} from 'react-native';
//import FilesystemStorage from 'redux-persist-filesystem-storage'
//import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
   // stateReconciler: autoMergeLevel1
   };
const pReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(pReducer);
export const persistor = persistStore(store);
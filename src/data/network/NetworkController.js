import store from '../../app/store';

import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import { setOnline, setOffline } from './networkStatusSlice';

export default class ConnectionMiddleware {

    static bindOnlineEvent() {
        window.addEventListener('online', () => {
            toast("You are Back Online !");
            store.dispatch(setOnline())
        }, false);
    }

    static bindOfflineEvent() {
        window.addEventListener('offline', () => {
            toast("You are Offline !");
            store.dispatch(setOffline())
        }, false);
    }

    static init() {
        ConnectionMiddleware.bindOnlineEvent();
        ConnectionMiddleware.bindOfflineEvent();
    }
}
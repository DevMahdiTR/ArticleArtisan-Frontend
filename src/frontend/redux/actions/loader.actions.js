import {LoaderTypes} from '../types/index';

export const toggleLoader = (status) => {
    return {
        type: LoaderTypes.TOGGLE_LOADER,
        payload: status,
    }
}


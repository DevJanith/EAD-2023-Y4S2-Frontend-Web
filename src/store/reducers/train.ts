// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { axiosServices } from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps, Train } from 'types/train';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['train'] = {
    error: null,
    success: null,
    trains: [],
    train: null,
    isLoading: false
};

const slice = createSlice({
    name: 'train',
    initialState,
    reducers: {
        // TO INITIAL STATE
        hasInitialState(state) {
            state.error = null;
            state.success = null;
            state.isLoading = false;
        },

        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        startLoading(state) {
            state.isLoading = true;
        },

        finishLoading(state) {
            state.isLoading = false;
        },

        // POST TRAIN
        addTrainSuccess(state, action) {
            state.success = "Train created successfully."
        },

        // GET TRAIN
        fetchTrainSuccess(state, action) {
            state.train = action.payload;
            state.success = null
        },

        // GET ALL TRAIN
        fetchTrainsSuccess(state, action) {
            state.trains = action.payload;
            state.success = null
        },

        // UPDATE TRAIN
        updateTrainSuccess(state, action) {
            state.success = "Train updated successfully."
        },

        // DELETE TRAIN
        deleteTrainSuccess(state, action) {
            state.success = "Train deleted successfully."
        },

    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

/**
 * TO INITIAL STATE
 * @returns 
 */
export function toInitialState() {
    return async () => {
        dispatch(slice.actions.hasInitialState())
    }
}

/**
 * POST TRAIN
 * @param newTrain 
 * @returns 
 */
export function addTrain(newTrain: Train) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.post('/api/Train', newTrain);
            dispatch(slice.actions.addTrainSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * GET TRAIN
 * @param id 
 * @returns 
 */
export function fetchTrain(id: number) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.get(`/api/Train/${id}`);
            dispatch(slice.actions.fetchTrainSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * GET ALL TRAINS 
 * @returns 
 */
export function fetchTrains() {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.get('/api/Train');
            dispatch(slice.actions.fetchTrainsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * UPDATE TRAIN
 * @param updatedTrain 
 * @returns 
 */
export function updateTrain(updatedTrain: Train) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.put(`/api/Train/${updatedTrain.id}`, updatedTrain);
            dispatch(slice.actions.updateTrainSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * DELETE TRAIN
 * @param trainId 
 * @returns 
 */
export function deleteTrain(trainId: string) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            await axiosServices.delete(`/api/Train/${trainId}`);
            dispatch(slice.actions.deleteTrainSuccess(trainId));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

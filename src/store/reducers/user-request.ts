// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { axiosServices } from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps, UserRequest, queryParamsProps } from 'types/user-request';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['userRequest'] = {
    error: null,
    success: null,
    userRequests: null,
    userRequest: null,
    isLoading: false
};

const slice = createSlice({
    name: 'userRequest',
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

        // POST USER REQUEST
        addUserRequestSuccess(state, action) {
            state.success = "User request created successfully."
        },

        // GET ALL USER REQUESTS
        fetchUserRequestsSuccess(state, action) {
            state.userRequests = action.payload;
            state.success = null
        },

        // DELETE USER REQUEST
        deleteUserRequestSuccess(state, action) {
            state.success = "User Request deleted successfully."
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
 * POST USER REQUEST
 * @param newUserRequest 
 * @returns 
 */
export function addUser(newUserRequest: UserRequest) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.post('/api/UserRequest', newUserRequest);
            dispatch(slice.actions.addUserRequestSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * GET ALL USER REQUESTS
 * @param queryParams 
 * @returns 
 */
export function fetchUserRequests(queryParams: queryParamsProps) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.get('/api/UserRequest', { params: queryParams });
            dispatch(slice.actions.fetchUserRequestsSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}


/**
 * DELETE USER Request
 * @param id 
 * @returns 
 */
export function deleteUserRequest(id: string) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            await axiosServices.delete(`/api/UserRequest/${id}`);
            dispatch(slice.actions.deleteUserRequestSuccess(id));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}
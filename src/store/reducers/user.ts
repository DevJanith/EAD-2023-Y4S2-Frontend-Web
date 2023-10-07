// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import { axiosServices } from 'utils/axios';
import { dispatch } from '../index';

// types
import { DefaultRootStateProps, User, queryParamsProps } from 'types/user';

// ----------------------------------------------------------------------

const initialState: DefaultRootStateProps['user'] = {
    error: null,
    success: null,
    users: null,
    user: null,
    currentUser: null,
    isLoading: false
};

const slice = createSlice({
    name: 'user',
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

        // POST USER
        addUserSuccess(state, action) {
            state.success = "User created successfully."
        },

        // GET USER
        fetchUserSuccess(state, action) {
            state.user = action.payload;
            state.success = null
        },

        // GET Current USER
        fetchCurrentUserSuccess(state, action) {
            state.currentUser = action.payload;
            state.success = null
        },

        // GET ALL USER
        fetchUsersSuccess(state, action) {
            state.users = action.payload;
            state.success = null
        },

        // UPDATE USER
        updateUserSuccess(state, action) {
            state.success = "User updated successfully."
        },

        // DELETE USER
        deleteUserSuccess(state, action) {
            state.success = "User deleted successfully."
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
 * POST USER
 * @param newUser 
 * @returns 
 */
export function addUser(newUser: User) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.post('/api/User', newUser);
            dispatch(slice.actions.addUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * GET USER
 * @param id 
 * @returns 
 */
export function fetchUser(id: number) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.get(`/api/User/${id}`);
            dispatch(slice.actions.fetchUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}


/**
 * GET CURRENT USER  
 * @returns 
 */
export function fetchCurrentUser() {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.get(`/api/User/GetCurrentUser`);
            dispatch(slice.actions.fetchCurrentUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}


/**
 * GET ALL USERS
 * @param queryParams 
 * @returns 
 */
export function fetchUsers(queryParams: queryParamsProps) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.get('/api/User', { params: queryParams });
            dispatch(slice.actions.fetchUsersSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * UPDATE USER
 * @param updatedUser 
 * @returns 
 */
export function updateUser(updatedUser: User) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            const response = await axiosServices.put(`/api/User/${updatedUser.id}`, updatedUser);
            dispatch(slice.actions.updateUserSuccess(response.data));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

/**
 * DELETE USER
 * @param userId 
 * @returns 
 */
export function deleteUser(userId: number) {
    return async () => {
        dispatch(slice.actions.startLoading());

        try {
            await axiosServices.delete(`/api/User/${userId}`);
            dispatch(slice.actions.deleteUserSuccess(userId));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        } finally {
            dispatch(slice.actions.finishLoading());
        }
    };
}

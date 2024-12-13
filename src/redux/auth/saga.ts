import { all, fork, put, takeEvery, call } from 'redux-saga/effects'
import { SagaIterator } from '@redux-saga/core'

// apicore
import { APICore, setAuthorization } from '../../helpers/api/apiCore'

// helpers
import { login as loginApi, logout as logoutApi, signup as signupApi, forgotPassword as forgotPasswordApi } from '../../helpers/api/auth'

// actions
import { authApiResponseSuccess, authApiResponseError } from './actions'

// constants
import { AuthActionTypes } from './constants'
import { supabase } from "@/api/client";

interface UserData {
	payload: {
		username: string
		password: string
		fullname: string
		email: string
	}
	type: string
}

interface OriginalUser {
    id: string;
    email: string;
    role: string;
    app_metadata: {
        provider: string;
        providers: string[];
    };
    user_metadata: Record<string, any>;
}

interface OriginalSession {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: OriginalUser;
}

interface OriginalResponse {
    data: {
        user: OriginalUser;
        session: OriginalSession;
    };
    error: any;
}

interface TransformedUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
}


const transformUser = (response: OriginalResponse): TransformedUser => {
    const { user, session } = response.data;


    return {
		id: 1, // Assuming a static ID for the example
        username: user.email, 
        firstName: 'Nipun', // Assuming a static first name for the example
        lastName: 'Perera', // Assuming a static last name for the example
        role: 'admin',
		token: session.access_token,
    };
};


const api = new APICore()

/**
 * Login the user
 * @param {*} payload - username and password
 */

function* login({ payload: { username, password } }: UserData): SagaIterator {
	try {
		


		async function signInWithEmail({username, password}: {username: string, password: string}) {
			const { data, error } = await supabase.auth.signInWithPassword({
				email: username,
				password: password,
			  })
			  return { data, error }
			}

		const response  = yield call(signInWithEmail, {username, password})
		if (response?.error) {
			const errorMessage = response.error.code === 'invalid_credentials' 
			  ? 'Invalid email or password'
			  : 'Authentication failed'
			  
			yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, errorMessage
			))
			api.setLoggedInUser(null)
			setAuthorization(null)
			return
		  }
		const transformedUser = transformUser(response );
		const user = transformedUser

		
			
		
		// NOTE - You can change this according to response format from your api
		api.setLoggedInUser(user)
		setAuthorization(user['token'])
		yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, user))
	} catch (error: any) {
		yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error))
		api.setLoggedInUser(null)
		setAuthorization(null)
	}
}

/**
 * Logout the user
 */
function* logout(): SagaIterator {
	try {
		yield call(logoutApi)
		api.setLoggedInUser(null)
		setAuthorization(null)
		yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}))
	} catch (error: any) {
		yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error))
	}
}

function* signup({ payload: { fullname, email, password } }: UserData): SagaIterator {
	try {
		const response = yield call(signupApi, { fullname, email, password })
		const user = response.data
		// api.setLoggedInUser(user);
		// setAuthorization(user['token']);
		yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user))
	} catch (error: any) {
		yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error))
		api.setLoggedInUser(null)
		setAuthorization(null)
	}
}

function* forgotPassword({ payload: { username } }: UserData): SagaIterator {
	try {
		const response = yield call(forgotPasswordApi, { username })
		yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data))
	} catch (error: any) {
		yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error))
	}
}
export function* watchLoginUser() {
	yield takeEvery(AuthActionTypes.LOGIN_USER, login)
}

export function* watchLogout() {
	yield takeEvery(AuthActionTypes.LOGOUT_USER, logout)
}

export function* watchSignup(): any {
	yield takeEvery(AuthActionTypes.SIGNUP_USER, signup)
}

export function* watchForgotPassword(): any {
	yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword)
}

function* authSaga() {
	yield all([fork(watchLoginUser), fork(watchLogout), fork(watchSignup), fork(watchForgotPassword)])
}

export default authSaga

export const types = {
	SIGN_IN: 'SIGN_IN',
	SIGN_OUT: 'SIGN_OUT'
};

export const signIn = () => {
	return {
		type: types.SIGN_IN
	};
};

export const signOut = () => {
	return {
		type: types.SIGN_OUT
	};
};
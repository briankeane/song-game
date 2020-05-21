import { configureStore } from '@reduxjs/toolkit';
import users from './users';

export default configureStore({
	reducer: {
		users,
	},
});
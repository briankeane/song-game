import React from 'react';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import reducers from './lib/redux/reducers';
import Welcome from './pages/Welcome';

const store = createStore(reducers);
	
const App = () => (
  <div>
  	<Welcome />
  </div>
);

export default () => (
	<Provider store={store}>
		<App />
	</Provider>
);
import React from 'react';
import { Provider } from 'react-redux';
import { Container } from 'semantic-ui-react';

import store from './redux';

import Header from './components/Header';
import Search from './components/Search';
import SelectedUser from './components/SelectedUser';

const App = () => (
  <div>
  	<Header />
  	<Container style={{ paddingTop: '7em' }}>
  		<Search />
  		<SelectedUser />
  	</Container>
  </div>
);

export default () => (
	<Provider store={store}>
		<App />
	</Provider>
);
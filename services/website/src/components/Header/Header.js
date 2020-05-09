import React from 'react';
import { connect } from 'react-redux';

import logo from '../../logo.svg';
import { Container, Menu, Image } from 'semantic-ui-react';

const Header = ({ pageName }) => (
	<Menu fixed="top" inverted>
		<Container>
			<Menu.Item header>
				<Image size='mini' src={logo} />
				User Search
			</Menu.Item>
			<Menu.Item style={{ flex: 1 }}>{pageName}</Menu.Item>
		</Container>
	</Menu>
);

const mapStateToProps = state => ({
	pageName: state.users.selected ? state.users.selected.name : '',
});

export default connect(mapStateToProps)(Header);
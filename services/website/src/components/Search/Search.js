import React from 'react';
import { connect } from 'react-redux';
import { Container, Search as UISearch } from 'semantic-ui-react';
import Fuse from 'fuse.js';

import { selectUser } from '../../redux/users';

const Search = ({ users, selectUser }) => {
	const [term, setTerm] = React.useState('');
	const filteredUsers = React.useMemo(() => {
		if (!term) return users;
		const fuse = new Fuse(users, {
			shouldSort: true,
			keys: ['name', 'username'],
		});
		return fuse.search(term);
	}, [users, term]);

	console.log('filteredUsers', filteredUsers);
	return (
		<Container>
			<UISearch
				onResultSelect={(e, { result }) => {
					setTerm('');
					selectUser(result.user);
				}}
				onSearchChange={e => setTerm(e.currentTarget.value)}
				results={filteredUsers.slice(0,5).map(user => ({
					title: user.name,
					description: user.username,
					image: user.avatar,
					user
				}))}
				value={term}
			/>
		</Container>
	);
};

const mapStateToProps = state => ({
	users: state.users.users,
});

const mapDispatchToProps = { selectUser };

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Search);
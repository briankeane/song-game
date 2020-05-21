import React from 'react';
import { connect } from 'react-redux';

import logo from '../../logo.svg';
import { Responsive,
	Container, 
	Menu, 
	Image,
	Sidebar,
	Icon,
	Segment,
	Button,
} from 'semantic-ui-react';

const getWidth = () => {
  const isSSR = typeof window === 'undefined';
  return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
}

const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Imagine-a-Company'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Do whatever you want when you want to.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button primary size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
);


class Header extends React.Component {
	state = {};
	handleSidebarHide = () => this.setState({ sidebarOpened: false });
	handleToggle = () => this.setState({ sidebarOpened: true });

	render() {
		const { children } = this.props;
		const { sidebarOpened } = this.state;

		return (
			<Responsive
				as={Sidebar.Pushable}
				getWidth={getWidth}
				maxWidth={Responsive.onlyMobile.maxWidth}
			>
				<Sidebar
					as={Menu}
					animation='push'
					inverted
					onHide={this.handleSidebarHide}
					verticle
					visible={sidebarOpened}
				>
					<Menu.Item as='a' active>
						Home
					</Menu.Item>
					<Menu.Item as='a'>Work</Menu.Item>
		          	<Menu.Item as='a'>Company</Menu.Item>
		          	<Menu.Item as='a'>Careers</Menu.Item>
		          	<Menu.Item as='a'>Log in</Menu.Item>
		          	<Menu.Item as='a'>Sign Up</Menu.Item>
		        </Sidebar>

		    	<Sidebar.Pusher dimmed={sidebarOpened}>

			    	<Segment
			            inverted
			            textAlign='center'
			            style={{ minHeight: 350, padding: '1em 0em' }}
			            vertical
			          >
			            <Container>
			              <Menu inverted pointing secondary size='large'>
			                <Menu.Item onClick={this.handleToggle}>
			                  <Icon name='sidebar' />
			                </Menu.Item>
			                <Menu.Item position='right'>
			                  <Button as='a' inverted>
			                    Log in
			                  </Button>
			                  <Button as='a' inverted style={{ marginLeft: '0.5em' }}>
			                    Sign Up
			                  </Button>
			                </Menu.Item>
			              </Menu>
			            </Container>
			            <HomepageHeading mobile />
			          </Segment>

			          {children}
		    
		    	</Sidebar.Pusher>
		    </Responsive>
		);
	}
}

export default connect(
	null, 
	{ signIn, signOut }
)(Header);
import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { DropdownButton , Dropdown , ButtonGroup } from 'react-bootstrap';

function App() {
	let animals = [ "seal" , "walrus" , "shark" ];

	// let animals = request.Get( "https://us-central1-c3-news-3321986615.cloudfunctions.net/api/feed/all" );
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload. Testing
				</p>

				<ul>
					{animals.map( x => (
						<li>{x}</li>
					))}
			 	</ul>

				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
			<body>
				{['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
				(variant) => (
				<DropdownButton
					as={ButtonGroup}
					key={variant}
					id={`dropdown-variants-${variant}`}
					variant={variant.toLowerCase()}
					title={variant}
				>
					<Dropdown.Item eventKey="1">Action</Dropdown.Item>
					<Dropdown.Item eventKey="2">Another action</Dropdown.Item>
					<Dropdown.Item eventKey="3" active>
					Active Item
					</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
				</DropdownButton>
				),
			)}
			</body>
		</div>
	);
}

export default App;

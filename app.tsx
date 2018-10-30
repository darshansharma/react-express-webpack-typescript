import * as ReactDOM from "react-dom";
import * as React from "react";
import mystakeLogo from './mystake.png';

class App extends React.Component<any, any> {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<h3 date-align="center"><img src={mystakeLogo} width="200px"/></h3><br />
			</div>
		);
	}
}

export default App;

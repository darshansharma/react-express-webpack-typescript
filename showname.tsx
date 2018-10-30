import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Button, Fade, Badge } from 'reactstrap';
import axios from 'axios';
import * as mystakeLogo from './mystake.png';



class ShowName extends React.Component<any, any>{
  constructor(props){
    super(props);
    this.state = {
      name: '',
    };

    this.showName = this.showName.bind(this);
    this.showNameUsingSocket = this.showNameUsingSocket.bind(this);
  }

  showName() {
    console.log('Fetching name from database ....');
    axios.get('/getName')
    .then((response) => {
      console.log(response);
      console.log(response.data[0].name);
      this.setState({name: response.data[0].name});
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  showNameUsingSocket() {
    let ws = new WebSocket("ws://localhost:8081", "myProtocol");
    axios.get('/getNameUsingSocket');
    ws.onopen = function(e) {
      console.log('Fetching name using socket ....');
    }
    ws.onmessage = function (e) {
      console.log(e);
    }
  }

  render() {
    return(
      <div style={{padding:'20px'}}>
        <h3 data-align="center"><img data-src={mystakeLogo} width="200px"/></h3><br />
        <h3>Name can be shown using - </h3>
        <Badge color="success">{this.state.name}</Badge><br /><br />
        <Button onClick={this.showName} color="primary">Simple mode</Button><br /><br />
        <Button onClick={this.showNameUsingSocket} color="primary">Socket mode</Button><br /><br />

      </div>
    );
  }
}
export default ShowName;

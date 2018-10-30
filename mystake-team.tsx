import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, Table, Input, Label, Alert } from 'reactstrap';
import mystakeLogo from './mystake.png';


class MyStakeTeam extends React.Component <any, any>{
  constructor(props){
    super(props);
    this.state = {
      data: [],
      age: '',
      name: '',
      toggleAlert: false,
      alertText: '',
    };
    this.checkAge = this.checkAge.bind(this);
    this.submitData = this.submitData.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.dissmiss = this.dissmiss.bind(this);
    this.timedAlert = this.timedAlert.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.dissmiss = this.dissmiss.bind(this);
    let ws = new WebSocket("ws://localhost:8081", "myProtocol");
    ws.onmessage = (e) => {
      console.log('jdkfkasj');
      console.log(e.data);
      if (e && e.data && e.data.includes('{')) {
        console.log('setting state');
        console.log(this.state.data);
        this.setState({ data: [...this.state.data, JSON.parse(e.data)] });
      }
    }
  }

  dissmiss() {
    this.setState({ toggleAlert: !this.state.toggleAlert });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  checkAge(e) {
    if ( /^[0-9]*$/g.test(e.target.value) ) {
      this.setState({age: e.target.value});
    }
  }

  timedAlert() {
    setTimeout(() => {
      this.setState({ toggleAlert: false });
    }, 5000);
  }

  deleteRow(e, name, age, index){
    axios.post('/deleteRow', {
      name,
      age
    }).then( (response) => {
      this.state.data.splice(index, 1);
      this.forceUpdate();
      console.log('Row deleted');
    }).catch(function (error){
      console.log(error);
    });
  }

  submitData(e) {
    this.setState({ alertText: 'Please fill all the fields'});
    if (this.state.name === '' || this.state.age === '') {
      this.setState({ toggleAlert: true });
      this.timedAlert();
    } else {
      axios.post('/insertData', {
      name: this.state.name,
      age: this.state.age
    })
    .then( (response) => {
      // console.log(response);
      this.setState({ alertText: response.data, toggleAlert: true, name: '', age: ''});
      this.timedAlert();
    })
    .catch(function (error) {
      console.log(error);
    });
    }

  }

  componentDidMount () {
    console.log('Fetching data from database ....');
    axios.get('/getTeamData')
    .then((response) => {
      console.log(response.data);
      if (!response.data) {
        response.data = [];
      }
      this.setState({ data: response.data });
    })
    .catch(function (error) {
      console.log(error);
    });

  }

  render() {
    return(
      <div style={{padding:'20px'}}>
        <h3 data-align="center"><img src={mystakeLogo} width="200px"/></h3><br />
        <h4 data-align="center">myStake Team</h4><br />
        <div data-align="center">
        <Table striped size='sm' responsive style={{ width: '500px'}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.data.map((record, index) =>
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{record.name}</td>
                <td>{record.age}</td>
                <td><button style={{cursor:'pointer', background:'inherit', border: '0', color:'red'}} className="deldatabtn" onClick={(e) => this.deleteRow(e, record.name, record.age, index)}>X</button></td>
              </tr>
            )
          }
        </tbody>
      </Table>
      </div>
      <hr /><br />
      <div data-align="center">
      <div style={{width: '500px'}}>
      <Alert color="info" isOpen={this.state.toggleAlert} toggle={this.dissmiss}>{this.state.alertText}</Alert>
      <h4>Add a new team member</h4><br />
      <Input type="text" name="name" id="name" placeholder="Name" onChange={this.handleNameChange} value={this.state.name} autoComplete="off"/><br />
      <Input type="text" name="name" id="name" placeholder="Age" onChange={this.checkAge} value={this.state.age} autoComplete="off"/><br />
      <Button color="primary" onClick={this.submitData}>Add</Button>
      </div></div>
      </div>
    );
  }
}
export default MyStakeTeam;

import * as React from "react";
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import App from './app';
import Page404 from './page404';
import ShowName from './showname';
import MyStakeTeam from './mystake-team';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css'

class Routing extends React.Component<any, any>{
render(){
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/app' component={App} />
        <Route exact path='/name' component={ShowName} />
        <Route exact path='/mystake' component={MyStakeTeam} />
        <Route path='*' component={Page404} />
      </Switch>
    </Router>
  );
}
}

ReactDOM.render(<Routing />, document.getElementById('app'));

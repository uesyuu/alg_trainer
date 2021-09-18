import React from "react";
import {HashRouter as Router, Route} from "react-router-dom";
import Home from "./Home";
import Trainer from "./Trainer";

function App() {
    return (
        <Router>
            <div>
                <Route exact path='/' component={Home}/>
                <Route path='/trainer' component={Trainer}/>
            </div>
        </Router>
    );
}

export default App;

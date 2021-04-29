import React from "react";
import './styles/app.scss';
import Header from "./components/Header";
import { Switch, Route } from "react-router";
import Home from "./pages/Home/Home"
import CreateFundraiser from "./pages/CreateFundraiser/CreateFundraiser"
import Fundraisers from "./pages/Fundraisers/Fundraisers"
import Tracker from "./pages/Tracker/Tracker"


function App() {
  return (
    <>
      <Header />
      
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/browse">
          <Fundraisers />
        </Route>
        <Route path="/create">
          <CreateFundraiser />
        </Route>
        <Route path="/track">
          <Tracker />
        </Route>
      </Switch>
    </>
  )
}

export default App

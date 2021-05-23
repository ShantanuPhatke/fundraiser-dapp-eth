import React, { useState, useEffect } from "react"
import "./styles/app.scss"
import Header from "./components/Header"
import { Switch, Route, Redirect } from "react-router"
import Home from "./pages/Home/Home"
import CreateFundraiser from "./pages/CreateFundraiser/CreateFundraiser"
import Fundraisers from "./pages/Fundraisers/Fundraisers"
import Track from "./pages/Track/Track"
import Donate from "./pages/Donate/Donate"
import NotFound404 from "./pages/NotFound404/NotFound404"
import Loader from "./components/Loader"

const App = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Header />

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/browse">
          <Fundraisers />
        </Route>
        <Route path="/donate/:fundraiserAddress">
          <Donate />
        </Route>
        <Route path="/create">
          <CreateFundraiser />
        </Route>
        <Route path="/track/:trackAddress?">
          <Track />
        </Route>
        <Route path="/404">
          <NotFound404 />
        </Route>
        <Redirect to="/404" />
      </Switch>
    </>
  )
}

export default App

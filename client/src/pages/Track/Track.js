import React, { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import TxnCard from "./components/TxnCard"

function Track() {
  const { trackAddress } = useParams()
  const [result, setResult] = useState()
  const [searchBarValue, setSearchBarValue] = useState("")
  const searchBar = useRef("")
  const searchIcon = useRef("")

  useEffect(async () => {
    if (!trackAddress) return

    const response = await fetch(
      `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${trackAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`
    )
    const data = await response.json()
    if (data.status === "1") {
      setResult(data.result)
    } else {
      console.error("Invalid Address")
      console.log(data)
      setResult()
    }
    setSearchBarValue(trackAddress)
  }, [trackAddress])

  useEffect(() => {
    setSearchBarValue(searchBar.current.value)
    searchBar.current.focus()
  }, [searchBar])

  const _handleChange = (e) => {
    setSearchBarValue(e.target.value)
  }

  const _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchIcon.current.click()
    }
  }

  return (
    <>
      <div className="container">
        <div
          className={
            searchBarValue !== ""
              ? "search-bar-container active"
              : "search-bar-container"
          }
        >
          <input
            type="text"
            className="search-bar"
            value={searchBarValue}
            onChange={_handleChange}
            onKeyDown={_handleKeyDown}
            id="search-bar"
            ref={searchBar}
          />
          <Link
            ref={searchIcon}
            className="icon"
            to={`/track/${searchBarValue}`}
          >
            🔍
          </Link>
        </div>
        <div className="txnCards">
          {trackAddress ? (
            result ? (
              // <pre>{JSON.stringify(result, null, 2)}</pre>
              result.map((item, i) => {
                if (item.from && item.to && item.value != 0) {
                  return <TxnCard txnDetails={item} key={i} />
                }
              })
            ) : (
              <div className="error">
                <h1>Invalid Address</h1>
              </div>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  )
}

export default Track

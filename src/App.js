import React, { useState, useEffect } from "react";
import "./App.css"
import Map from './map'
import "tailwindcss/tailwind.css"
import Navbar from "./navbar";

import Select from 'react-select'
import axios from "axios";


const App = (props) => {
  let select_please_wait = {
    value: '',
    label: 'Please Wait'
  }
  const [countries, setCountries] = useState([select_please_wait]);
  const [countryLat, setCountryLat] = useState();
  const [countryLong, setCountryLong] = useState();
  const [selectedCountry, setSelectedCountry] = useState();

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState();

  const [cities, setCities] = useState([select_please_wait]);
  const [selectedCity, setSelectedCity] = useState();

  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {

    const getCountries = () => {
      let tempArr = [];
      axios.get('https://countriesnow.space/api/v0.1/countries/positions')
        .then((result) => {
          if (!result.data?.error) {
            let processMap = result.data.data.map(country => {
              tempArr.push({
                value: { lat: country.lat, long: country.long },
                label: country.name
              })
            });

            return Promise.all(processMap).then(() => {
              setCountries(tempArr)
            })
          }
        })
    }

    getCountries();

  }, [])

  const countrySelected = (event) => {
    // console.log(event) //event.value contains {lat,long}, event.label contains country
    setCountryLat(event.value.lat);
    setCountryLong(event.value.long);
    setMapZoom(4);

    axios.post('https://countriesnow.space/api/v0.1/countries/iso', { country: event.label })
      .then(result => {
        if (result && result.data) {
          event.Iso2 = result.data.data.Iso2;
          event.Iso3 = result.data.data.Iso3;
        }
      })
      .finally(() => {
        setSelectedCountry(event);
      })

    axios.post('https://countriesnow.space/api/v0.1/countries/states', { country: event.label })
      .then(result => {
        if (result && result.data) {
          // console.log(result.data.data.states)
          let tempArr = []
          let processMap = result.data.data.states.map(state => {
            tempArr.push({
              value: state.state_code,
              label: state.name
            })
          })
          return Promise.all(processMap).then(() => {
            setStates(tempArr)
          })
          // setStates(result.data.data.states);
        }
      })
  }

  // useEffect(() => {
  //   console.log('selectedCountry:', selectedCountry)
  // }, [selectedCountry])

  const stateSelected = (event) => {
    // console.log(event)

    axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_API_GEO_KEY}&query=${event.label}&country=${selectedCountry.Iso2}`)
      .then(result => {
        let closestToSearch = result.data.data.sort((a, b) => Math.abs(1 - a.confidence) - Math.abs(1 - b.confidence))[0];
        // console.log('ISO State:', closestToSearch)
        setSelectedState(closestToSearch)

      })
    const getCities = () => {
      axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: selectedCountry.label, state: event.label })
        .then(result => {
          // console.log(result)
          if (result && result.data) {

            let tempArr = []
            let processMap = result.data.data.map(city => {
              tempArr.push({
                value: city,
                label: city
              })
            })
            return Promise.all(processMap).then(() => {
              setCities(tempArr)
            })
            // setStates(result.data.data.states);
          }
        });
    }
    getCities();
  }

  useEffect(() => {
    if (selectedState) {
      // console.log(selectedState)
      setCountryLat(selectedState.latitude)
      setCountryLong(selectedState.longitude)
      setMapZoom(7)
    }
  }, [selectedState])

  const citySelected = (e) => {
    // console.log(e);
    axios.get(`http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_API_GEO_KEY}&query=${e.value}&country=${selectedCountry.Iso2}`)
      .then(result => {
        // console.log(result.data.data)
        let closestToSearch = result.data.data.sort((a, b) => Math.abs(1 - a.confidence) - Math.abs(1 - b.confidence))[0];
        // console.log(closestToSearch)
        setSelectedCity(closestToSearch)
      })
  }

  useEffect(() => {
    if (selectedCity) {
      // console.log(selectedCity)
      setCountryLat(selectedCity.latitude);
      setCountryLong(selectedCity.longitude)
      setMapZoom(12)
    }
  }, [selectedCity])

  useEffect(() => {
    console.log(countryLat, countryLong)
  }, [countryLat, countryLong])
  return (
    <div>
      {/* <Navbar /> */}
      < div className="grid grid-rows-1  h-screen" >
        <div className="grid grid-cols-12 gap-4 ml-3 mt-3">

          <div className="col-span-4">
            <div className="flex gap-3 mb-4">
              {/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="country" type="text" placeholder="Country" /> */}
              <Select onChange={(e, a) => countrySelected(e)} placeholder="Select Country" className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" options={countries} />
              {/* <button className="bg-transparent hover:bg-green-500 text-green-400 font-semibold hover:text-white px-4 border border-green-500 hover:border-transparent w-1/4 h-10 mt-2">Get Cities</button> */}
            </div>
            <div className="space-y-1">
              <Select onChange={(e, a) => stateSelected(e)} placeholder="Select State" className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" options={states} />
            </div>
            <div className="space-y-1">
              <Select onChange={(e, a) => citySelected(e)} placeholder="Type the initials of the City" className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" options={cities} />
            </div>


          </div>
          <div className="col-span-8" >

            <Map lat={countryLat} long={countryLong} zoom={mapZoom} />
          </div>

        </div>
      </div >

    </div >
  );
}

export default App;
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

  const [cities, setCities] = useState([select_please_wait]);
  const [displayCities, setDisplayCities] = useState([]);

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
  //   console.log(countryLat, countryLong)
  // }, [countryLat, countryLong])

  const countrySelected = (event) => {
    console.log(event) //event.value contains {lat,long}, event.label contains country
    setCountryLat(event.value.lat);
    setCountryLong(event.value.long);

    const getCities = () => {
      let tempArr = []
      axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: event.label })
        .then(result => {
          if (!result.data?.error) {
            console.log(result.data.data)
            let processMap = result.data.data.map(city => {
              tempArr.push({
                value: city.toLowerCase(),
                label: city
              })
            })
            return Promise.all(processMap).then(() => {
              setCities(tempArr)
            })
          }
        });
    }
    getCities();
  }
  useEffect(() => {
    let tempArr = [];
    for (let i = 0; i < 7; i++) {
      tempArr.push(cities[i])
    }
    setDisplayCities(tempArr);
  }, [cities])

  const showCity = (e) => {
    console.log(e);
    const result = cities.filter(city => city.value.startsWith(e))
    setDisplayCities(result)
  }

  const citySelected = (e) => {
    console.log(e)
  }
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
              <Select onChange={(e, a) => citySelected(e)} onInputChange={(e) => showCity(e)} placeholder="Type the initials of the City" className="appearance-none w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" options={displayCities} />
            </div>


          </div>
          <div className="col-span-8" >

            <Map lat={countryLat} long={countryLong} />
          </div>

        </div>
      </div >

    </div >
  );
}

export default App;
import React from "react";
import "./App.css"
import Map from './map'
import "tailwindcss/tailwind.css"
const App = (props) => {

  return (
    <div className="App" class="p-6 items-center justify-center">
      <Map />
      <h1 class="text-blue-400 font-extrabold">Hello World!</h1>

    </div>
  );
}

export default App;
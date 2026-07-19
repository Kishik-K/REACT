import React from "react";
import Search from "./components/search";

function App() {
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find what you <span className="text-gradient">desire</span>
          </h1>
        </header>
        <Search />
      </div>
    </main>
  );
}

export default App;

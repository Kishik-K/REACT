import React, { useState, useEffect } from "react";

const Card = ({ title }) => {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    console.log(`${title}, Has been liked: ${hasLiked}`);
  }, [count, hasLiked]);

  useEffect(() => {
    console.log("Card Rendered");
  }, []);

  return (
    <div
      className="card"
      onClick={() => {
        setCount((value) => value + 1);
      }}
    >
      <h2>
        {title} <br />
        Count: {count}
      </h2>

      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? "Liked" : "Like"}
      </button>
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <Card title="STAR WARS" />
      <Card title="THE LORD OF THE RINGS" />
      <Card title="THE HUNGER GAMES" />
    </div>
  );
};

export default App;

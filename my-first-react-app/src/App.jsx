const Card = ({ title }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
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

const Card = ({ title }) => {
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
};

const App = () => {
  return (
    <>
      <h2>Welcome to React</h2>
      <Card title="STAR WARS" />
      <Card title="THE LORD OF THE RINGS" />
      <Card title="THE HUNGER GAMES" />
    </>
  );
};

export default App;

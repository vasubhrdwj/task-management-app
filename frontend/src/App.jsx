import { React, useState } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }
  return (
    <div>
      <h1>Counters updating seperately</h1>
      <MyButton onClick={handleClick} count={count} />
      <MyButton onClick={handleClick} count={count} />
    </div>
  );
};

function MyButton({ count, onClick }) {
  return <button onClick={onClick}> Clicked {count} times</button>;
}
export default App;

import React, { useState } from 'react';

import Button from '../../components/Button/Button';

const Home: React.FC = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      {' '}
      <p>You clicked {count} times! can I deploy?</p>
      <Button text="Click me" onClick={handleClick} />
    </div>
  );
};

export default Home;

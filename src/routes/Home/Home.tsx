import React from 'react';

import Button from '@components/Button/Button';

const Home: React.FC = () => {
  return (
    <div>
      {/* button 사용 예시 props = {size(small, medium, large) / $variant(primary or null)}, children = text ※theme 참고※ */}
      <Button size="small">중복확인</Button>
      <Button size="large" $variant="primary">
        로그인
      </Button>
    </div>
  );
};

export default Home;

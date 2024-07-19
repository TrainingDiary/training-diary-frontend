import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Tabs from '@components/Tabs/Tabs';
import TraineeManagement from './TraineeManagement';
import WorkOutManagement from './WorkOutManagement';

const TrainerHome: React.FC = () => {
  const tabs = [
    { label: '트레이니 관리', path: '/trainer/trainees' },
    { label: '운동 종류 관리', path: '/trainer/workouts' },
  ];

  return (
    <React.Fragment>
      <Tabs tabs={tabs} />
      <Routes>
        <Route path="/" element={<Navigate to="/trainer/trainees" />} />
        <Route path="trainees" element={<TraineeManagement />} />
        <Route path="workouts" element={<WorkOutManagement />} />
      </Routes>
    </React.Fragment>
  );
};

export default TrainerHome;

import { useState } from 'react';

interface ModalState {
  [key: string]: boolean;
}

const useModals = () => {
  const [modals, setModals] = useState<ModalState>({});

  const openModal = (modalName: string) => {
    setModals((prevModals) => ({ ...prevModals, [modalName]: true }));
  };

  const closeModal = (modalName: string) => {
    setModals((prevModals) => ({ ...prevModals, [modalName]: false }));
  };

  const isOpen = (modalName: string) => !!modals[modalName];

  return {
    openModal,
    closeModal,
    isOpen,
  };
};

export default useModals;

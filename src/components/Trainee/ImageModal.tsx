// ImageModal.tsx
import React from 'react';
import styled from 'styled-components';

import Modal from '@components/Common/Modal/Modal';

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OriginalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
`;

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
}) => (
  <Modal
    type="custom"
    title="사진 확대"
    isOpen={isOpen}
    onClose={onClose}
    btnConfirm="none"
  >
    <ImageWrapper>
      <OriginalImage src={imageUrl} alt="원본 이미지" />
    </ImageWrapper>
  </Modal>
);

export default ImageModal;

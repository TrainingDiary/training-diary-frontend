import React, { useState } from 'react';
import styled from 'styled-components';

import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { hexToRgba } from 'src/utils/hexToRgba';

const PhotoUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    max-width: 100px;
    text-align: center;
    padding: 5px 10px;
    border: solid 1px ${({ theme }) => theme.colors.gray300};
    border-radius: 5px;
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: 0 2px 2px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.2)};
    cursor: pointer;

    &:active {
      background-color: ${({ theme }) => theme.colors.gray600};
      color: ${({ theme }) => theme.colors.white};
    }
  }
`;

const LabelWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;

  span {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.red400};
    flex: 1;
  }
`;

const PhotoInput = styled.input`
  display: none;
`;

const PhotoPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PhotoPreviewItem = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.gray200};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: 'x';
    position: absolute;
    top: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.gray600};
    color: ${({ theme }) => theme.colors.white};
    width: 15px;
    height: 15px;
    line-height: 1;
    padding: 1px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (photos: File[]) => void;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [errorAlert, setErrorAlert] = useState<string>('');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const existingPhotos = new Set(selectedPhotos.map(photo => photo.name));

      if (files.length + selectedPhotos.length > 10) {
        setErrorAlert('사진은 최대 10장 입니다.');
        return;
      }

      const newPhotos = files.filter(file => !existingPhotos.has(file.name));
      setSelectedPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleUpload = () => {
    if (selectedPhotos.length === 0) {
      setErrorAlert('사진을 1장 이상 등록해주세요.');
      return;
    }
    onUpload(selectedPhotos);
    setSelectedPhotos([]);
  };

  const handleClose = () => {
    onClose();
    setSelectedPhotos([]);
  };

  const handleDeletePhoto = (index: number) => {
    setSelectedPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <Modal
      type="custom"
      title="사진 업로드"
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleUpload}
      btnConfirm="업로드"
    >
      <PhotoUploadContainer>
        <LabelWrap>
          <label htmlFor="photo-upload">사진 선택</label>
          <span>사진은 최대 10장 까지 등록 가능합니다.</span>
        </LabelWrap>
        <PhotoInput
          id="photo-upload"
          type="file"
          accept="image/png, image/jpeg"
          multiple
          onChange={handlePhotoChange}
        />
        <PhotoPreview>
          {selectedPhotos.map((photo, index) => (
            <PhotoPreviewItem
              key={index}
              onClick={() => handleDeletePhoto(index)}
            >
              <img
                src={URL.createObjectURL(photo)}
                alt={`선택된 사진 ${index}`}
              />
            </PhotoPreviewItem>
          ))}
        </PhotoPreview>
      </PhotoUploadContainer>
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </Modal>
  );
};

export default PhotoUploadModal;

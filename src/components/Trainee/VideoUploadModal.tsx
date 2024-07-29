import React, { useState } from 'react';
import styled from 'styled-components';

import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { hexToRgba } from 'src/utils/hexToRgba';

const VideoUploadContainer = styled.div`
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

const VideoInput = styled.input`
  display: none;
`;

const VideoPreview = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray200};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (video: File) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [errorAlert, setErrorAlert] = useState<string>('');
  const MAX_VIDEO_SIZE_MB = 200; // 용량 회의 후 변경

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileSizeMB = file.size / 1024 / 1024;

      if (fileSizeMB > MAX_VIDEO_SIZE_MB) {
        setErrorAlert(
          `동영상 용량은 ${MAX_VIDEO_SIZE_MB}MB 이하로 등록해주세요.`
        );
        return;
      }

      setSelectedVideo(file);
    }
  };

  const handleUpload = () => {
    if (selectedVideo) {
      onUpload(selectedVideo);
      setSelectedVideo(null);
    } else {
      setErrorAlert('동영상을 선택해주세요.');
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedVideo(null);
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <Modal
      type="custom"
      title="동영상 업로드"
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleUpload}
      btnConfirm="업로드"
    >
      <VideoUploadContainer>
        <LabelWrap>
          <label htmlFor="video-upload">동영상 선택</label>
          <span>동영상은 하나씩만 등록 가능합니다.</span>
        </LabelWrap>
        <VideoInput
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
        {selectedVideo && (
          <VideoPreview>
            <video src={URL.createObjectURL(selectedVideo)} controls />
          </VideoPreview>
        )}
      </VideoUploadContainer>
      {errorAlert && (
        <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
      )}
    </Modal>
  );
};

export default VideoUploadModal;

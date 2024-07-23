import React, { useState } from 'react';
import styled from 'styled-components';

import Modal from '@components/Common/Modal/Modal';

const VideoUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  onUpload: (video: string) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedVideo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = () => {
    if (selectedVideo) {
      onUpload(selectedVideo);
      setSelectedVideo(null);
    }
  };

  return (
    <Modal
      type="custom"
      title="동영상 업로드"
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleUpload}
      btnConfirm="업로드"
    >
      <VideoUploadContainer>
        <label htmlFor="video-upload">동영상 선택</label>
        <VideoInput
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
        />
        {selectedVideo && (
          <VideoPreview>
            <video src={selectedVideo} controls />
          </VideoPreview>
        )}
      </VideoUploadContainer>
    </Modal>
  );
};

export default VideoUploadModal;

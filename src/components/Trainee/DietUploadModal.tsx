import React, { useRef } from 'react';
import styled from 'styled-components';

import addImg from '@icons/diet/addImg.svg';

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Input = styled.input`
  display: none;
`;

const CustomFileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  padding: 5px 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.gray500};
  font-family: 'NanumSquareExtraBold';
  font-size: 1.6rem;
  cursor: pointer;

  &:active {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`;

const PreviewWrapper = styled.div`
  width: 36px;
  height: 36px;
  cursor: pointer;
`;

const Preview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Message = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 1.2rem;
`;

const TextArea = styled.textarea`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;
  outline: none;
  width: 100%;
  height: 92px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray900};
  font-size: 1.6rem;
  font-family:
    'NanumSquare',
    'NotoSans KR',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  resize: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

interface FormData {
  photo: FileList | null;
  content: string;
}

interface DietUploadModalProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const DietUploadModal: React.FC<DietUploadModalProps> = ({
  formData,
  setFormData,
  preview,
  setPreview,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.files?.length) {
      const files = e.target.files;
      const file = files[0];
      setFormData({ ...formData, photo: files });
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }

    if (e.target instanceof HTMLTextAreaElement) {
      setFormData({ ...formData, content: value });
    }
  };

  const onRemoveImage = () => {
    setFormData({ ...formData, photo: null });
    setPreview(null);
  };

  return (
    <Form>
      <Label>
        <span>사진첨부 :</span>
        <FileInputWrapper>
          <Input
            ref={inputRef}
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleChange}
          />
          <CustomFileLabel htmlFor="photo">
            <img src={addImg} alt="upload image" />
            <span>사진 선택</span>
          </CustomFileLabel>
          {preview && (
            <PreviewWrapper onClick={onRemoveImage}>
              <Preview src={preview} alt="preview" />
            </PreviewWrapper>
          )}{' '}
          {!preview && <Message>사진을 등록해주세요.</Message>}
        </FileInputWrapper>
      </Label>
      <Label>
        <span>내용 :</span>
        <TextArea
          value={formData.content}
          onChange={handleChange}
          placeholder="Content"
        />
      </Label>
    </Form>
  );
};

export default DietUploadModal;

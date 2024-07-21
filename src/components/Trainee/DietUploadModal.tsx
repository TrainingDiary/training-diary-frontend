import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';

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
`;

interface FormData {
  photo: FileList | null;
  content: string;
}

interface DietUploadModalProps {
  onChangeFormData: (data: FormData) => void;
  formData: FormData;
}

const DietUploadModal: React.FC<DietUploadModalProps> = ({
  onChangeFormData,
  formData,
}) => {
  const { register, watch, setValue, reset } = useForm<FormData>({
    defaultValues: formData,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(
    '사진을 등록해주세요'
  );

  const photo = watch('photo');
  const content = watch('content');

  const onRemoveImage = () => {
    setValue('photo', null);
    setPreview(null);
    setPhotoMessage('사진을 등록해주세요');
  };

  useEffect(() => {
    onChangeFormData({ photo, content });

    if (photo && photo.length > 0) {
      const file = photo[0];
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setPhotoMessage(null);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setPreview(null);
      setPhotoMessage('사진을 등록해주세요');
    }
  }, [photo, content]);

  useEffect(() => {
    reset(formData);
  }, [formData]);

  return (
    <Form>
      <Label>
        <span>사진첨부 :</span>
        <FileInputWrapper>
          <Input
            type="file"
            id="photo"
            accept="image/*"
            {...register('photo')}
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
          <Message>{photoMessage}</Message>
        </FileInputWrapper>
      </Label>
      <Label>
        <span>내용 :</span>
        <TextArea {...register('content')} />
      </Label>
    </Form>
  );
};

export default DietUploadModal;

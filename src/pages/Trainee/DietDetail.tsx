import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

import threeDots from '@icons/diet/threeDots.svg';
import commentAvatar from '@icons/diet/commentAvatar.svg';
import activeSendComment from '@icons/diet/activeSendComment.svg';
import inactiveSendComment from '@icons/diet/inactiveSendComment.svg';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { hexToRgba } from 'src/utils/hexToRgba';
import useModals from 'src/hooks/useModals';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ImgContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 6px 8px ${({ theme }) => hexToRgba(theme.colors.black, 0.35)};

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 5px;
  box-shadow: 0 2px 6px ${({ theme }) => hexToRgba(theme.colors.main500, 0.6)};
`;

const PostDate = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.gray600};
`;

const ContentsBox = styled.div`
  display: flex;
`;

const Contents = styled.p`
  flex: 1;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const DotButton = styled.div`
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: relative;
`;

const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 100%;
  bottom: 100%;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 5px;
  box-shadow: 0 1px 4px ${({ theme }) => hexToRgba(theme.colors.black, 0.35)};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
  padding: 10px 42px;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: 1.4rem;
  cursor: pointer;

  &:hover,
  &:active {
    background: ${({ theme }) => theme.colors.gray200};
  }
`;

const CommentContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`;

const CommentText = styled.p`
  flex: 1;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.gray900};
`;

const CommentInput = styled.textarea`
  flex: 1;
  height: 60px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 5px;
  outline: none;
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray700};
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

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60px;
  gap: 3px;
`;

const Button = styled.button`
  padding: 2px 35px;
  font-size: 1.6rem;
  cursor: pointer;
  border: none;
  border-radius: 5px;
`;

const SaveButton = styled(Button)`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.main500};

  &:hover,
  &:active {
    background: ${({ theme }) => theme.colors.main700};
  }
`;

const CancelButton = styled(Button)`
  color: ${({ theme }) => theme.colors.gray600};
  background: ${({ theme }) => theme.colors.gray100};
  border: 1px solid ${({ theme }) => theme.colors.gray200};

  &:hover,
  &:active {
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

const SendCommentInputWrapper = styled.div<{
  $hasContent: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  background-color: ${({ theme, $hasContent }) =>
    $hasContent ? theme.colors.white : theme.colors.gray200};
`;

const SendCommentInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: 1.4rem;
  background-color: transparent;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const SendCommentButton = styled.div<{
  $hasContent: boolean;
}>`
  width: 25px;
  height: 25px;
  cursor: ${({ $hasContent }) => ($hasContent ? 'pointer' : 'not-allowed')};

  img {
    width: 100%;
    height: 100%;
  }
`;

const DietDetail: React.FC = () => {
  const navigate = useNavigate();
  const { traineeId } = useParams<{ traineeId: string }>();
  const { openModal, closeModal, isOpen } = useModals();
  const [postMenuVisible, setPostMenuVisible] = useState<boolean>(false);
  const [commentMenuVisible, setCommentMenuVisible] = useState<boolean>(false);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [errorAlert, setErrorAlert] = useState<string>('');

  const togglePostMenu = () => {
    setPostMenuVisible(!postMenuVisible);
  };

  const toggleCommentMenu = () => {
    setCommentMenuVisible(!commentMenuVisible);
  };

  const onSaveModal = (modalName: string) => {
    if (modalName === 'deletePostModal') {
      // 식단 삭제 API 요청 단계 추가
      navigate(`/trainee/${traineeId}/diet`);
    } else if (modalName === 'deleteCommentModal') {
      // 댓글 삭제 API 요청 단계 추가 (refetch)
    }

    closeModal(modalName);
  };

  const onEditComment = () => {
    setEditCommentId(1);
    setCommentText('조금 더 노력하면 더 좋은 결과를 얻을 수 있을 것 같습니다.');
  };

  const onCancelEdit = () => {
    setEditCommentId(null);
  };

  const onSaveEdit = () => {
    if (!commentText) return setErrorAlert('댓글을 입력해주세요.');

    // 댓글 수정 API 요청 단계 추가
    setEditCommentId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const onAddComment = () => {
    if (!newComment) return;

    // 댓글 추가 API 요청 단계 추가
    console.log(newComment);
    setNewComment('');
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  return (
    <SectionWrapper>
      <Wrapper>
        <ImgContainer>
          <img
            src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=3751&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="diet image"
          />
        </ImgContainer>
        <ContentsContainer>
          <PostDate>2024. 07. 12.</PostDate>
          <ContentsBox>
            <Contents>
              오늘은 샐러드를 먹는 중입니다.
              <br />
              영양가 있는 샐러드를 먹으니 몸이 건강해지는 느낌입니다.
              <br />
              다음에는 더 맛있는 걸 먹고 싶습니다.
            </Contents>
            <DotButton onClick={togglePostMenu}>
              <img src={threeDots} alt="Button group: Delete options" />
              {postMenuVisible && (
                <DropdownMenu>
                  <MenuItem onClick={() => openModal('deletePostModal')}>
                    삭제
                  </MenuItem>
                </DropdownMenu>
              )}
            </DotButton>
          </ContentsBox>
        </ContentsContainer>
        <CommentContainer>
          <img src={commentAvatar} alt="avatar image" />
          {editCommentId ? (
            <React.Fragment>
              <CommentInput
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <ButtonContainer>
                <SaveButton onClick={onSaveEdit}>수정</SaveButton>
                <CancelButton onClick={onCancelEdit}>취소</CancelButton>
              </ButtonContainer>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <CommentText>
                조금 더 노력하면 더 좋은 결과를 얻을 수 있을 것 같습니다.
              </CommentText>
              <PostDate>2024. 07. 12.</PostDate>
              <DotButton onClick={toggleCommentMenu}>
                <img
                  src={threeDots}
                  alt="Button group: Edit and delete options"
                />
                {commentMenuVisible && (
                  <DropdownMenu>
                    <MenuItem onClick={onEditComment}>수정</MenuItem>
                    <MenuItem onClick={() => openModal('deleteCommentModal')}>
                      삭제
                    </MenuItem>
                  </DropdownMenu>
                )}
              </DotButton>
            </React.Fragment>
          )}
        </CommentContainer>
        <SendCommentInputWrapper $hasContent={!!newComment}>
          <SendCommentInput
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Comment"
          />
          <SendCommentButton onClick={onAddComment} $hasContent={!!newComment}>
            <img
              src={!!newComment ? activeSendComment : inactiveSendComment}
              alt="send comment button"
            />
          </SendCommentButton>
        </SendCommentInputWrapper>
        <Modal
          title="게시글 삭제"
          type="confirm"
          isOpen={isOpen('deletePostModal')}
          onClose={() => closeModal('deletePostModal')}
          onSave={() => onSaveModal('deletePostModal')}
          btnConfirm="삭제"
        >
          선택한 게시글을 삭제할까요?
        </Modal>
        <Modal
          title="댓글 삭제"
          type="confirm"
          isOpen={isOpen('deleteCommentModal')}
          onClose={() => closeModal('deleteCommentModal')}
          onSave={() => onSaveModal('deleteCommentModal')}
          btnConfirm="삭제"
        >
          선택한 댓글을 삭제할까요?
        </Modal>
        {errorAlert && (
          <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
        )}
      </Wrapper>
    </SectionWrapper>
  );
};

export default DietDetail;

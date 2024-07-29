import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import threeDots from '@icons/diet/threeDots.svg';
import commentAvatar from '@icons/diet/commentAvatar.svg';
import activeSendComment from '@icons/diet/activeSendComment.svg';
import inactiveSendComment from '@icons/diet/inactiveSendComment.svg';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Modal from '@components/Common/Modal/Modal';
import Alert from '@components/Common/Alert/Alert';
import { hexToRgba } from 'src/utils/hexToRgba';
import formatDate from 'src/utils/formatDate';
import useModals from 'src/hooks/useModals';
import useFetchUser from 'src/hooks/useFetchUser';
import CreateTraineeApi from 'src/api/trainee';
import useUserStore from 'src/stores/userStore';

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
  white-space: pre-line;
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

interface Comment {
  id: number;
  comment: string;
  createdDate: string;
}

interface DietDetailData {
  id: number;
  imageUrl: string;
  content: string;
  comments: Comment[];
  createdDate: string;
}

const DietDetail: React.FC = () => {
  useFetchUser();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const traineeApi = CreateTraineeApi(navigate);
  const { traineeId, dietId } = useParams<{
    traineeId: string;
    dietId: string;
  }>();
  const { openModal, closeModal, isOpen } = useModals();
  const [postMenuVisible, setPostMenuVisible] = useState<boolean>(false);
  const [commentMenuVisible, setCommentMenuVisible] = useState<number | null>(
    null
  );
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [errorAlert, setErrorAlert] = useState<string>('');

  const fetchDietDetail = async (): Promise<DietDetailData> => {
    const response = await traineeApi.getDietDetail(parseInt(dietId!));
    return response.data;
  };

  const {
    data: dietDetail,
    isLoading,
    refetch,
  } = useQuery<DietDetailData>(['dietDetail', dietId], fetchDietDetail);

  const togglePostMenu = () => {
    setPostMenuVisible(!postMenuVisible);
  };

  const toggleCommentMenu = (commentId: number) => {
    setCommentMenuVisible(prev => (prev === commentId ? null : commentId));
    setDeleteCommentId(commentId);
  };

  const onSaveModal = async (modalName: string) => {
    if (modalName === 'deletePostModal') {
      try {
        await traineeApi.deleteDiet(parseInt(dietId!));
        navigate(`/trainee/${traineeId}/diet`);
      } catch (error) {
        console.error('식단 삭제 에러: ', error);
      }
    } else if (modalName === 'deleteCommentModal') {
      try {
        await traineeApi.deleteComment(deleteCommentId!);
        setDeleteCommentId(null);
        refetch();
      } catch (error) {
        console.error('댓글 삭제 에러: ', error);
      }
    }

    closeModal(modalName);
  };

  const onEditComment = (comment: Comment) => {
    setEditCommentId(comment.id);
    setCommentText(comment.comment);
  };

  const onCancelEdit = () => {
    setEditCommentId(null);
  };

  const onSaveEdit = async () => {
    if (!commentText) return setErrorAlert('댓글을 입력해주세요.');

    try {
      await traineeApi.editComment(editCommentId!, commentText);
      refetch();
      setEditCommentId(null);
      setCommentText('');
    } catch (error) {
      console.error('댓글 수정 에러: ', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const onAddComment = async () => {
    if (!newComment) return;

    try {
      await traineeApi.addComment(parseInt(dietId!), newComment);
      refetch();
      setNewComment('');
    } catch (error) {
      console.error('댓글 추가 에러: ', error);
    }
  };

  const onCloseErrorAlert = () => setErrorAlert('');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SectionWrapper>
      <Wrapper>
        <ImgContainer>
          <img src={dietDetail!.imageUrl} alt="diet image" />
        </ImgContainer>
        <ContentsContainer>
          <PostDate>{formatDate(dietDetail!.createdDate)}</PostDate>
          <ContentsBox>
            {/* <Contents
              dangerouslySetInnerHTML={{
                __html: dietDetail!.content.replace(/\n/g, '<br />'),
              }}
            /> */}
            <Contents>{dietDetail!.content}</Contents>
            {user?.role === 'TRAINEE' && (
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
            )}
          </ContentsBox>
        </ContentsContainer>
        {dietDetail!.comments.map(comment => (
          <CommentContainer key={comment.id}>
            <img src={commentAvatar} alt="avatar image" />
            {editCommentId === comment.id ? (
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
                <CommentText>{comment.comment}</CommentText>
                <PostDate>{formatDate(comment.createdDate)}</PostDate>
                {user?.role === 'TRAINER' && (
                  <DotButton onClick={() => toggleCommentMenu(comment.id)}>
                    <img
                      src={threeDots}
                      alt="Button group: Edit and delete options"
                    />
                    {commentMenuVisible === comment.id && (
                      <DropdownMenu>
                        <MenuItem onClick={() => onEditComment(comment)}>
                          수정
                        </MenuItem>
                        <MenuItem
                          onClick={() => openModal('deleteCommentModal')}
                        >
                          삭제
                        </MenuItem>
                      </DropdownMenu>
                    )}
                  </DotButton>
                )}
              </React.Fragment>
            )}
          </CommentContainer>
        ))}

        {user?.role === 'TRAINER' && (
          <SendCommentInputWrapper $hasContent={!!newComment}>
            <SendCommentInput
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Comment"
            />
            <SendCommentButton
              onClick={onAddComment}
              $hasContent={!!newComment}
            >
              <img
                src={!!newComment ? activeSendComment : inactiveSendComment}
                alt="send comment button"
              />
            </SendCommentButton>
          </SendCommentInputWrapper>
        )}

        {user?.role === 'TRAINEE' && (
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
        )}
        {user?.role === 'TRAINER' && (
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
        )}
        {errorAlert && (
          <Alert $type="error" text={errorAlert} onClose={onCloseErrorAlert} />
        )}
      </Wrapper>
    </SectionWrapper>
  );
};

export default DietDetail;

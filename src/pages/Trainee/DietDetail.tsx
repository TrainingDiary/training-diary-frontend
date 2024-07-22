import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

import threeDots from '@icons/diet/threeDots.svg';
import { SectionWrapper } from '@components/Common/SectionWrapper';
import Modal from '@components/Common/Modal/Modal';
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
  border-radius: 8px;
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

const DietDetail: React.FC = () => {
  const navigate = useNavigate();
  const { traineeId } = useParams<{ traineeId: string }>();
  const { openModal, closeModal, isOpen } = useModals();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const onSaveModal = (modalName: string) => {
    if (modalName === 'deletePostModal') {
      // 식단 삭제 API 요청 단계 추가
      navigate(`/trainee/${traineeId}/diet`);
    } else if (modalName === 'deleteCommentModal') {
      // 댓글 삭제 API 요청 단계 추가
    }

    closeModal(modalName);
  };

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
            <DotButton onClick={toggleMenu}>
              <img src={threeDots} alt="Button group: Delete options" />
              {menuVisible && (
                <DropdownMenu>
                  {/* <MenuItem onClick={() => alert('수정 클릭됨')}>수정</MenuItem> */}
                  <MenuItem onClick={() => openModal('deletePostModal')}>
                    삭제
                  </MenuItem>
                </DropdownMenu>
              )}
            </DotButton>
          </ContentsBox>
        </ContentsContainer>
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
      </Wrapper>
    </SectionWrapper>
  );
};

export default DietDetail;

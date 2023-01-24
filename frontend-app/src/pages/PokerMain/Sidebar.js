import React from 'react';
import * as Router from 'react-router-dom';
import styled from 'styled-components';
import ArrowRightIcon from '../../assets/icons/right_arrow.png';
import {useSelector} from "react-redux";

const Container = styled.div`
  height: 100%;
  width: 25%;
  border-radius: 30px;
  background-color: rgb(62, 62, 62);
  padding: 20px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`

const Header = styled.span`
  font-family: MM Armen;
  font-style: Normal;
  font-size: 30px;
  line-height: 32px;
  text-align: center;
  vertical-align: center;
  letter-spacing: 3px;
  color: #FFFFFF;
`;

const ProfileContainer = styled.div`
  background-color: #585858;
  height: 100px;
  width: 100%;
  margin-top: 80px;
  margin-bottom: 50px;
  padding: 10px;
  display: flex;
  gap: 20px;
  color: blanchedalmond;
  border-radius: 10px;
`;

const ProfileImg = styled.div(props => {
    return `
      background-image: url(${props.src || "http://localhost:3335/static/poker/profiles/empty.png"});
      background-position: center;
      background-size: 160px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid blanchedalmond;
`
});

const LinkContainer = styled.div`
  background-color: #585858;
  bottom: 10px;
  height: 40px;
  width: 100%;
  border-radius: 10px;
  color: blanchedalmond;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: .3s;
  &:hover {
    cursor: pointer;
    transition: .3s;
    padding: 0 10px 0 20px;
    text-decoration: underline;
  }
`

const ExitContainer = styled.div`
  background-color: #585858;
  bottom: 10px;
  height: 40px;
  width: 100%;
  border-radius: 10px;
  margin-top: auto;
  color: blanchedalmond;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Link = styled(Router.Link)`
   text-decoration: none;
`

const links = [
    {
        path: '/poker/players',
        name: 'Players'
    }
]

export default function Sidebar() {
    const {userData} = useSelector(state => state.auth);
    console.log(userData);
    return (
        <Container>
            <HeaderContainer>
                <Header>Poker</Header>
                <img src="http://localhost:3335/static/poker/logo.svg" width="60px" height="60px" alt="logo"/>
            </HeaderContainer>
            <ProfileContainer>
                <ProfileImg src={userData.profile_img_url || "http://localhost:3335/static/poker/profiles/empty.png"}/>
                <span> {userData.username} </span>
            </ProfileContainer>

            {
                links.map(link => {
                    return (
                        <Link to={link.path} key={link.name}>
                            <LinkContainer>
                                {link.name} <img src={ArrowRightIcon}/>
                            </LinkContainer>
                        </Link>
                    )
                })
            }

            <ExitContainer>
                Logout
            </ExitContainer>
        </Container>
    )
}

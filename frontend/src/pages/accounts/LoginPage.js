import React, { useState } from 'react';
import HeaderComp from '../../components/base/HeaderComp';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const LoginPage = ({ history }) => {
  // 기본 정보
  const [ username, setUsername ] = useState('');             // 이름
  const [ email, setEmail ] = useState('');                   // 이메일
  const [ password, setPassword ] = useState('');             // 비밀번호
  
  // 추가 정보
  const [ image, setImage ] = useState('');                   // 프로필 사진
  const [ nickname, setNickname ] = useState('');             // 닉네임
  const [ university, setUniversity ] = useState('');         // 학교
  const [ major, setMajor] = useState('');                    // 전공
  const [ job, setJob ] = useState('');                       // 직업
  const [ work, setWork ] = useState('');                     // 직장
  const [ birth, setBirth ] = useState('');                   // 생년월일
  const [ height, setHeight ] = useState('');                 // 키
  const [ weight, setWeight ] = useState('');                 // 체형
  const [ personality, setPersonality ] = useState('');       // 성격
  const [ bloodType, setBloodType ] = useState('');           // 혈액형
  const [ smoking, setSmoking ] = useState('');               // 흡연여부
  const [ religion, setReligion ] = useState('');             // 종교

  // 토큰
  const [cookies, setCookie] = useCookies(['access-token']);  // 토큰

  const setUsernameText = e => {
    setUsername(e.target.value);
  }
  const setEmailText = e => {
    setEmail(e.target.value);
  };
  const setPasswordText = e => {
    setPassword(e.target.value);
  };

  const sendLoginData = e => {
    e.preventDefault()
    const loginData = {username, email, password}
    console.log(loginData, '로그인 정보')
    axios.post('/rest-auth/login/', loginData)
      .then((response) => {
        console.log('로그인 성공')
        setCookie('access-token', response.data.key)
        history.push('/main')
      })
      .catch((error) => console.log(error))
  };

  return (
    <div>
      <HeaderComp />
      <h1>로그인</h1>
      <div className="w-25">
        <form onSubmit={sendLoginData} className="d-flex flex-column">
          <input placeholder="이름" username={username} onChange={setUsernameText} />
          <input placeholder="이메일" email={email} onChange={setEmailText} />
          <input placeholder="비밀번호" password={password} onChange={setPasswordText} />
          <button type="submit">로그인</button>
        </form>
      </div>
      <small>아직 회원이 아니신가요?</small>
      <a href="/signup">회원가입</a>
    </div>
  );
};

export default LoginPage;
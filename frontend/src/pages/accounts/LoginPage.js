import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ history }) => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  
  const [cookies, setCookie] = useCookies(['accessToken']);

  const setEmailText = e => {setEmail(e.target.value)};
  const setPasswordText = e => {setPassword(e.target.value)};

  const sendLoginData = e => {
    e.preventDefault()
    const loginData = { email, password }
    axios.post('/api/login', loginData)
      .then((response) => {
        setCookie('accessToken', response.data.accessToken)
        history.push('/main')
        alert('로그인이 되었습니다.')
      })
      .catch((error) => {
        console.log(error)
        alert('로그인 정보를 확인해주세요.')
      })
  };

  return (
    <div className="login-template d-flex flex-column align-items-center">
      <div className="login-box">
        <h4 className="text-center login-name">설 렘 다 방</h4>
        <form onSubmit={sendLoginData} className="login-form">
          <input className="login-input" placeholder="이메일" email={email} onChange={setEmailText} />
          <input type="password" className="login-input" placeholder="비밀번호" password={password} onChange={setPasswordText} />
          <div className="login-footer">
            <div style={{fontSize:"15px"}}>아직 회원이 아니신가요?</div>
            <Link to="/signup" className="text-decoration-none">회원가입</Link>
          </div>
          <button className="login-button" type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
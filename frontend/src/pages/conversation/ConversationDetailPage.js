import React, { useState, useEffect }  from 'react';

// Axios
import axios from 'axios';

// CSS
import './ConversationDetailPage.css';

// Cookie
import { useCookies } from 'react-cookie';

// Audio Record
import { ReactMic } from 'react-mic';

// Audio Player
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// History
import { useHistory } from "react-router-dom";

// Images
import RecordStart from '../../assets/signup/RecordStart.png';
import RecordStop from '../../assets/signup/RecordStop.png';
import RecordDelete from '../../assets/signup/RecordDelete.png';

const ConversationDetailPage = ({ match }) => {
  const history = useHistory();
  const [ cookies, setCookie ] = useCookies(['accessToken']);
  const [ ucookies, setUcookie ] = useCookies(['user']);

  const [ loading, setLoading ] = useState(false);

  const [ messages, setMessages ] = useState('');

  const [ record, setRecord ] = useState(false);
  const [ voice, setVoice ] = useState('');
  const [ voiceurl, setVoiceurl ] = useState('');

  const startRecording = () => {
    setRecord(true);
  };
  const stopRecording = () => {
    setRecord(false)
  };
  const onStop = (recordedBlob) => {
    setVoice(recordedBlob.blob);
    setVoiceurl(recordedBlob.blobURL);
  };
  const removeRecord = () => {
    setVoice('');
    setVoiceurl('');
  };

  const config = {
    headers: {
      'Authorization': 'Bearer ' + cookies.accessToken
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/conversation/list/${match.params.conversationId}`, config
        );
        setMessages(response.data)
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const sendMessage = () => {
    if (voice) {
      const conversationFile = new FormData();
      const conversationName = Date.now();
      conversationFile.append('voice', voice, 'voice'+ conversationName);
      axios.post(`/api/conversation/create/${match.params.conversationId}`, conversationFile, config)
      .then (() => {
        setVoice('')
        console.log('성공?')
        history.go()
        }
      )
      .catch((error) => {
        console.log(error);
      })
    } else {
      alert('음성을 입력해주세요.')
    }
  }
  const sendPropose = () => {
    const conversationFile = {
      "propose": 1,
    }

    axios.post(`/api/conversation/propose/${match.params.conversationId}`, null, config)
    .then (() => {
      history.go()
      }
    )
    .catch((error) => {
      console.log(error);
    })
  }

  if (loading) {
    return <h1>대기 중...</h1>;
  };
  if (!messages) {
    return null;
  };

  const startCall = () => {
    history.push(`/call/${match.params.conversationId}`)
  }

  return (
    <div className="conversation-template d-flex flex-column align-items-center">
      <div className="conversation-inner">
        {messages.map((message, index) => (
          <div className="d-flex flex-column">
            {ucookies.user == message.user.id ? 
              <div className="align-self-end m-1">
                <h5>{message.user.nickname} 님</h5>
                {message.voice != '화상채팅 신청' ?
                <div>
                  <AudioPlayer
                  key={index}
                  src={'https://k3b103.p.ssafy.io:8080/api/voice/' + message.voice}
                  showJumpControls={false}
                  customVolumeControls={[]}
                  customAdditionalControls={[]}
                  style={{
                    width: '300px'
                  }}
                />
                <h6>{message.text}</h6>
                </div>
                : 
                <div className="d-flex flex-column align-items-center">
                  <h6>우리 화상 미팅 해볼래요?</h6>
                  <button className="w-50 enter-button" onClick={startCall}>입장하기</button>         
                </div>
                }
                
              </div>
            : 
            <div className="align-self-start m-1">
              <h5>{message.user.nickname} 님</h5>
              {message.voice != '화상채팅 신청' ?
              <div>
                  <AudioPlayer
                  key={index}
                  src={'https://k3b103.p.ssafy.io:8080/api/voice/' + message.voice}
                  showJumpControls={false}
                  customVolumeControls={[]}
                  customAdditionalControls={[]}
                  style={{
                    width: '300px'
                  }}
                />
                <h6>{message.text}</h6>
                </div>
                :
                <div className="d-flex flex-column align-items-center">
                <h6>우리 화상 미팅 해볼래요?</h6>
                <button className="w-50 enter-button" onClick={startCall}>입장하기</button>         
                </div>
                }
              
            </div>
            }
          </div>
          )
        )}
      </div>
      {!voice && (
        <div className="d-flex flex-column align-items-center mt-3">
          <ReactMic
            record={record}
            className="sound-wave w-50"
            onStop={onStop}
            strokeColor="white"
            backgroundColor="#c6e5d9" />
          <div>
            {!record && (
              <button className="record-button" onClick={startRecording} type="button"><img className="record-img mr-2" src={RecordStart} />녹음시작</button>
            )}
            {record && (
              <button className="record-button" onClick={stopRecording} type="button"><img className="record-img mr-2" src={RecordStop} />녹음종료</button>
            )}
          </div>
        </div>
      )}
      {voice && (
        <div className="d-flex flex-column align-items-center mt-3">
          <AudioPlayer
            src={voiceurl}
            showJumpControls={false}
            customVolumeControls={[]}
            customAdditionalControls={[]}
            style={{
              width: '300px'
            }}
          />
          <button 
            onClick={removeRecord}
            type="button"
            className="record-button"
          >
            <img className="record-img mr-2" src={RecordDelete} />다시녹음
          </button>
        </div>
      )}
      <div className="conver-footer d-flex justify-content-center">
      <button className="conversation-button" onClick={sendMessage}>보내기</button>
      <button className="conversation-button-call" onClick={sendPropose}>미팅신청</button>
      </div>
    </div>
  )
};

export default ConversationDetailPage;
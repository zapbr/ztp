import './App.css';
import React, { useEffect, useState } from "react";
import axios from 'axios';

function App() {
  const [fntSize, setFntSize] = useState(54);
  const [roller, setRoller] = useState(10);
  const [txtY, setTxtY] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const changeFontSize = (increment = true) => {
    setFntSize((increment) ? fntSize + 2 : fntSize - 2)
    setTxtY(0);
  }

  const changeSpeed = (increment = true) => {
    setRoller((increment) ? roller - 10 : roller + 10)
  }

  const mirror = () => {
    const _border = document.getElementById('editorBox');
    _border.classList.toggle("flip_H")
  }

  const save = () => {
    axios.post('http://192.168.0.9/service/save.php', {
      font: fntSize,
      speed: roller,
      text: document.getElementById('editorBox').innerHTML,
    }).then((response) => {
      console.log('SALVADO')
    })

  }

  useEffect(() => {
    axios.get('http://192.168.0.9/service/index.php').then((response) => {
      console.log(response)
      if (response.data) {
        setFntSize(response.data.font || 0);
        setRoller(response.data.speed || 10);
        document.getElementById('editorBox').innerHTML = response.data.text
      }
    })
  }, []);

  useEffect(() => {
    let intervalID
    console.log(isPlaying)
    if (isPlaying) {
      const _box = document.getElementById('editorBox');

      intervalID = setInterval(() => {
        if ((_box.scrollTop + _box.offsetHeight) < _box.scrollHeight) {
          setTxtY(p => p + 1);
        } else {
          setIsPlaying(false)
        }
        setTxtY(p => p + 1);
      }, roller)
    }
    return () => {
      console.log(`---- clear interval`)
      clearInterval(intervalID)
    }
  }, [isPlaying, roller])


  useEffect(() => {
    document.getElementById('editorBox').scrollTop = txtY

  }, [txtY])


  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  const updateStatus = () => {
    const joystick = navigator.getGamepads()[0];

    if (joystick) {
      let buttons = {
        top: joystick.buttons[3],
        right: joystick.buttons[1],
        bottom: joystick.buttons[0],
        left: joystick.buttons[2],
      }

      if (navigator.userAgent.includes('Windows')) {
        buttons = {
          top: joystick.buttons[4],
          right: joystick.buttons[1],
          bottom: joystick.buttons[0],
          left: joystick.buttons[3],
        }
      }

      if (buttons.bottom.pressed) {
        setTxtY(prev => prev - 20)
      }
      if (buttons.right.pressed) {
        setIsPlaying(true)
      }
      if (buttons.left.pressed) {
        setIsPlaying(false)
      }

      if (buttons.top.pressed) {
        setTxtY(prev => prev + 20)
      }
    }

    requestAnimationFrame(updateStatus);
  }


  window.addEventListener("gamepadconnected", (e) => {
    const gp = navigator.getGamepads()[e.gamepad.index];
    console.log(`Gamepad connected at index ${gp.index}: ${gp.id}. It has ${gp.buttons.length} buttons and ${gp.axes.length} axes.`);
    requestAnimationFrame(updateStatus);
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    cancelAnimationFrame(updateStatus);
  });



  return (
    <section>
      <div className='controls'>
        <button onClick={() => setIsPlaying(true)} ><i id="btnPlay" className="fa fa-play" aria-hidden="true"></i></button>
        <button onClick={() => setIsPlaying(false)} ><i id="btnPause" className="fa fa-pause" aria-hidden="true"></i></button>
        &nbsp;

        &nbsp;
        Font Size: {fntSize}
        &nbsp;
        <button onClick={() => changeFontSize()}><i id="btnFontPlus" className="fa fa-plus-square" aria-hidden="true"></i></button>
        <button onClick={() => changeFontSize(false)}><i id="btnFontMinus" className="fa fa-minus-square" aria-hidden="true"></i></button>
        &nbsp;
        &nbsp;
        Speed: {((roller - 1000) * -1) / 100}
        &nbsp;
        <button onClick={() => changeSpeed()}><i id="btnFontPlus" className="fa fa-plus-square-o" aria-hidden="true"></i></button>
        <button onClick={() => changeSpeed(false)} ><i id="btnFontMinus" className="fa fa-minus-square-o" aria-hidden="true"></i></button>
        &nbsp;
        &nbsp;
        <button onClick={() => setTxtY(prev => prev + 20)}><i id="btnUp" className="fa fa-arrow-up" aria-hidden="true"></i></button>
        <button onClick={() => setTxtY(prev => prev - 20)}><i id="btnDown" className="fa fa-arrow-down" aria-hidden="true"></i></button>

        &nbsp;
        &nbsp;
        <button onClick={toggleFullScreen}><i className="fa fa-arrows-alt" aria-hidden="true"></i></button>
        &nbsp;
        &nbsp;
        <button onClick={mirror}><i className="fa fa-reply" aria-hidden="true"></i></button>

      </div>
      <div className='controls'>
        <button onClick={() => setTxtY(0)}><i className="fa fa-angle-double-up" aria-hidden="true"></i></button>
        &nbsp;
        &nbsp;
        <button onClick={save}><i className="fa fa-floppy-o" aria-hidden="true"></i></button>
      </div>

      <div
        id='editorBox'
        contentEditable="true"
        suppressContentEditableWarning={true}
        className="editor"
        style={{
          fontSize: fntSize,
        }}
      >... loading</div>

    </section>


  );
}

export default App;

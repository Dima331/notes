import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown'
import Draggable from 'react-draggable';
import Button from 'react-bootstrap/Button';
import { ResizableBox } from 'react-resizable';
import { X } from 'react-bootstrap-icons';
import '../styles/drag.css';
import '../styles/styles.css';

export const Note = () => {
  const [text, setText] = useState('');
  const mark = useRef(null);
  const colorNote = useRef(null);
  const [view, setView] = useState('');
  const [block, setBlock] = useState(false);
  const [flag, setFlag] = useState('#ffde8f');
  const style = { backgroundColor: flag };

  const textHandler = (e) => { setText(e.target.value) }

  const handleDrag = (e, ui) => {
    console.log(ui.deltaX, ui.deltaY)
  };

  const renderMarkdown = () => {
    setView(mark.current.innerHTML)
    setBlock(prev => !block)
  }

  const colorNoteHandler = (color) => {
    setFlag(color)
  }

  return (
    <div>
      <Draggable
        handle="strong"
        onDrag={handleDrag}>
        <ResizableBox
          className="box"
          width={205} height={285}
          minConstraints={[205, 255]} >
          <div
            className='note'
            ref={colorNote}
            style={style}>
            <strong>
              <div className='note__header'>
                <ul className='color-list'>
                  <li className='color-list__item'>
                    <Button 
                      className='btn-color btn-color_yellow' 
                      onClick={() => colorNoteHandler('#ffde8f')}
                    ></Button></li>
                  <li className='color-list__item'>
                    <Button 
                      className='btn-color btn-color_blue' 
                      onClick={() => colorNoteHandler('#cfd0ff')}
                    ></Button></li>
                  <li className='color-list__item'>
                    <Button 
                      className='btn-color btn-color_pink' 
                      onClick={() => colorNoteHandler('#ffd3f7')}
                    ></Button></li>
                </ul>
                <div className='control'>
                  <Button variant="primary" size="sm" className="edit" variant="success" onClick={renderMarkdown}>
                    {block ? 'edit': 'save'}</Button>
                  <Button variant="success" className="delete box no-cursor"><X/></Button>
                </div>
              </div>
              <div className="note__content">
                {!block && 
                  <textarea
                    className="note__text"
                    value={text}
                    name='text'
                    onChange={textHandler}></textarea>
                }
                {block && <div dangerouslySetInnerHTML={{ __html: view.toString() }}></div>}
              </div>
            </strong>
          </div>
        </ResizableBox>
      </Draggable>
      <div
        ref={mark} >
        <ReactMarkdown
          children={text}
          className='hide-text' />
      </div>
    </div>
  )
}
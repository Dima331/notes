import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'
import Draggable from 'react-draggable';
import Button from 'react-bootstrap/Button';
import { ResizableBox } from 'react-resizable';
import { X } from 'react-bootstrap-icons';
import '../styles/drag.css';
import '../styles/styles.css';

export const Note = () => {
  const [activNote, setActivNote] = useState({ width: 205, height: 285 });
  let [activeDrags, setActiveDrags] = useState(0);
  let [zIndex, setZindex] = useState(1);
  const [color, setColor] = useState([{ hex: '#ffde8f', name: 'yellow' },
                                        { hex: '#cfd0ff', name: 'blue' },
                                        { hex: '#ffd3f7', name: 'pink' },]);
  const [notes, setNotes] = useState([
    {
      id: 1,
      activeColor: '#ffde8f',
      text: '',
      textEdit: false,
      show: false,
      zIndex: 0,
      width: 205,
      height: 285,
      defX: 0,
      defY: 0,
      x: 0,
      y: 0
    },
    {
      id: 2,
      activeColor: '#ffde8f',
      text: '',
      textEdit: true,
      show: false,
      zIndex: 0,
      width: 205,
      height: 285,
      defX: 0,
      defY: 0,
      x: 0,
      y: 0
    },
  ]);

  const changeTextHandler = (note) => {
    setNotes(notes.map(item => {
      if (item.id === note.id) {
        item.textEdit = !item.textEdit;
      }
      return item;
    }
    ));
  };

  const changeMarkdownHandler = (e, note) => {
    setNotes(notes.map(item => {
      if (item.id === note.id) {
        item.text = e.target.value;
      }
      return item;
    }
    ));
  };

  const addHandler = (e) => {
    let lastId = 1;

    if (notes.length) {
      lastId = notes[notes.length - 1].id;
    }

    setNotes(prev => ([
      ...prev, {
        id: ++lastId,
        activeColor: '#ffde8f',
        text: '',
        textEdit: true,
        show: false,
        zIndex: ++zIndex,
        width: 205,
        height: 285,
        defX: 304,
        defY: -94,
        x: 0,
        y: 0,
      },
    ]));
    setZindex(++zIndex);
  };

  const indexHandler = (e, note) => {
    setNotes(prev => prev.map(item => {
      if (item.id === note.id) {
        item.zIndex = zIndex;
      }
      return item;
    }
    ));
    setZindex(prev => ++prev);
    setActivNote(note);
  };

  const deleteHandler = (e, note) => {
    setNotes(prev => prev.filter(item => {
      if (item.id !== note.id) {
        return item;
      }
      
      return false;
    }));
  };

  const changeColorHandler = (note, color) => {
    setNotes(notes.map(item => {
      if (item.id === note.id) {
        item.activeColor = color;
      }
      return item;
    }
    ));
  };

  const showOver = (note) => {
    setNotes(notes.map(item => {
      if (item.id === note.id) {
        item.show = !item.show;
      }
      return item;
    }
    ));
  };

  const showOut = (note) => {
    setNotes(notes.map(item => {
      if (item.id === note.id) {
        item.show = false;
      }
      return item;
    }
    ));
  };

  const onResize = (e, note) => {
    setNotes(prev => prev.map(item => {
      if (+item.id === +note.node.parentElement.attributes[0].value) {
        item.width = note.size.width;
        item.height = note.size.height;
      }
      return item;
    }
    ));
  };

  const handleDrag = (e, note) => {
    setNotes(prev => prev.map(item => {
      if (+item.id === +note.node.attributes[0].value) {
        item.defX = note.x;
        item.defY = note.y;
      }
      return item;
    }
    ));
  };

  const onControlledDrag = (e, position) => {
    const { x, y } = position;

    setNotes(prev => prev.map(item => {
      if (+item.id === +position.node.attributes[0].value) {
        item.x = x;
        item.y = y;
      }
      return item;
    }));


  };

  const onControlledDragStop = (e, position) => {
    onControlledDrag(e, position);
    onStop();
  };

  const onStop = () => {
    setActiveDrags(prev => --prev);
  };

  return (
    <>
      { notes && notes.map((note, i) => (
        <div key={i}>
          <Draggable
            handle="strong"
            onDrag={handleDrag}
            element={note.id}
            position={{ x: note.x, y: note.y }}
            defaultPosition={{ x: note.x, y: note.y }}
            onStop={onControlledDragStop}
          >
            <ResizableBox
              onResize={onResize}
              element={note.id}
              className="box"
              style={{ zIndex: note.zIndex }}
              width={note.width} 
              height={note.height}
              onMouseOver={() => showOver(note)}
              onMouseOut={() => showOut(note)}
              minConstraints={[205, 255]}
              onClick={(e) => indexHandler(e, note)}
            >
              <div
                className='note'
                style={{ backgroundColor: note.activeColor }}>
                <strong>
                  {<div className={'note__header ' + (note.show ? 'active' : '')}>
                    <ul className='color-list'>
                      {color.map((color, i) => (
                        <li key={i} className='color-list__item'>
                          <Button
                            className={`btn-color btn-color_${color.name}`}
                            onClick={() => changeColorHandler(note, color.hex)}
                          ></Button></li>
                      ))}
                    </ul>
                    <div className='control'>
                      <Button size="sm" className="edit" variant="success" onClick={() => changeTextHandler(note)}>
                        {note.textEdit ? 'edit' : 'save'}</Button>
                      <Button variant="success" className="delete" onClick={(e) => deleteHandler(e, note)}><X /></Button>
                    </div>
                  </div>}
                  <div className="note__content">
                    {!note.textEdit &&
                      <textarea
                        className="note__text"
                        value={note.text}
                        name='text'
                        onChange={(e) => changeMarkdownHandler(e, note)}></textarea>
                    }
                    {note.textEdit && <ReactMarkdown
                      children={note.text}
                      className='hide-text' />}
                  </div>
                </strong>
              </div>
            </ResizableBox>
          </Draggable>
        </div>
      ))
      }
      <Button style={{ width: '100%' }} onClick={(e) => addHandler(e)}>Add</Button>
    </>
  )
}
import React, { useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import { X } from 'react-bootstrap-icons';
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader'
import ReactMarkdown from 'react-markdown'
import Draggable from 'react-draggable';
import Button from 'react-bootstrap/Button';
import socket from '../socket';
import '../styles/drag.css';
import '../styles/styles.css';

export const Note = () => {
  const [activeNote, setActiveNote] = useState({ width: 205, height: 285 });
  let [activeDrags, setActiveDrags] = useState(0);
  let [zIndex, setZindex] = useState(1);
  const { request, loading } = useHttp();
  const [color, setColor] = useState(
    [{ hex: '#ffde8f', name: 'yellow' },
    { hex: '#cfd0ff', name: 'blue' },
    { hex: '#ffd3f7', name: 'pink' },]);
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
    try {
      const data = await request(`/api/notes`, 'GET', null);
      if (data) {
        setNotes(data);
        
        let maxIndex = zIndex;
        data.map(item => {
          if (item.z_index > maxIndex) {
            maxIndex = item.z_index
          }
          return item;
        })
        setZindex(maxIndex)
      }
    } catch (e) { }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const setNewNote = (note) => {
    if (note) {
      setNotes(prev => ([...prev, note]));
    }
  };

  const setNewDelete = (note) => {
    let position;

    setNotes(prev => {
      const scraps = prev.map((item, i) => {
        if (+item.name === +note.name) {
          position = i;
        }
        return item;
      })
      scraps.splice(position, 1);
      return scraps;
    });
  };

  const setIndexHandler = (note) => {
    if (note) {
      setNotes(prev => prev.map(item => {
        if (item.name === note.name) {
          item.z_index = note.z_index;
        }
        return item;
      }
      ));
      setZindex(note.z_index);
    }
  };

  const setNoteHandler = (note) => {
    let position;

    setNotes(prev => {
      const scraps = prev.map((item, i) => {
        if (+item.name === +note.name) {
          position = i;
        }
        return item;
      })
      scraps.splice(position, 1, note);
      return scraps;
    });
  };

  useEffect(() => {
    socket.on('SET_ADD', setNewNote);
    socket.on('SET_CHANGE_DELETE', setNewDelete);
    socket.on('SET_NOTE', setNoteHandler);
    socket.on('SET_CHANGE_INDEX', setIndexHandler);
  }, []);

  const addHandler = (e) => {
    let lastId = 1;

    if (notes.length) {
      lastId = notes[notes.length - 1].name;
    };

    const newNote = {
      name: ++lastId,
      active_color: '#ffde8f',
      text: '',
      text_edit: false,
      show: false,
      z_index: ++zIndex,
      width: 205,
      height: 285,
      defX: 304,
      defY: -94,
      x: 0,
      y: 0,
    };

    setNotes(prev => ([
      ...prev, newNote,
    ]));

    setZindex(++zIndex);
    socket.emit('ADD', newNote);
  };

  const deleteHandler = (e, note) => {
    setNotes(prev => prev.filter(item => {
      if (item.name !== note.name) {
        return item;
      }

      return false;
    }));
    socket.emit('CHANGE_DELETE', note);
  };

  const changeColorHandler = (note, color) => {
    setNotes(notes.map(item => {
      if (item.name === note.name) {
        item.active_color = color;
      }
      return item;
    }
    ));
    socket.emit('CHANGE_NOTE', note);
  };

  const changeTextHandler = (note) => {
    setNotes(notes.map(item => {
      if (item.name === note.name) {
        item.textEdit = !item.textEdit;
      }
      return item;
    }
    ));
    socket.emit('CHANGE_NOTE', note);
  };

  const changeMarkdownHandler = (e, note) => {
    setNotes(notes.map(item => {
      if (item.name === note.name) {
        item.text = e.target.value;
      }
      return item;
    }
    ));
  };

  const indexHandler = (e, note) => {
    let position;

    setNotes(prev => prev.map((item, i) => {
      if (item.name === note.name) {
        item.z_index = zIndex;
        position = i;
      }
      return item;
    }
    ));
    setNotes(prev => {
      socket.emit('CHANGE_INDEX', notes[position]);
      socket.emit('CHANGE_NOTE', notes[position]);
      return prev;
    });
    setZindex(prev => ++prev);
    setActiveNote(note);
  };

  const showOver = (note) => {
    setNotes(notes.map(item => {
      if (item.name === note.name) {
        item.show = !item.show;
      }
      return item;
    }
    ));
  };

  const showOut = (note) => {
    setNotes(notes.map(item => {
      if (item.name === note.name) {
        item.show = false;
      }
      return item;
    }
    ));
  };

  const onResize = (e, note) => {
    const name = +note.node.parentElement.attributes[0].value;
    let position;

    setNotes(prev => prev.map((item, i) => {
      if (+item.name === name) {
        item.width = note.size.width;
        item.height = note.size.height;
        position = i;
      }
      return item;
    }
    ));
  };

  const handleDrag = (e, note) => {
    setNotes(prev => prev.map(item => {
      if (+item.name === +note.node.attributes[0].value) {
        item.defX = note.x;
        item.defY = note.y;
      }
      return item;
    }
    ));
  };

  const onControlledDrag = (e, position) => {
    const { x, y } = position;
    const name = +position.node.attributes[0].value;
    let positionElement;

    setNotes(prev => prev.map((item, i) => {

      if (+item.name === name) {
        item.x = x;
        item.y = y;
        positionElement = i;
      }
      return item;
    }));
    socket.emit('CHANGE_NOTE', notes[positionElement]);
  };

  const onControlledDragStop = (e, position) => {
    onControlledDrag(e, position);
    onStop();
  };

  const onStop = () => {
    setActiveDrags(prev => --prev);
  };

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <>
      { notes && notes.map((note, i) => (
        <div key={i}>
          <Draggable
            handle="strong"
            onDrag={handleDrag}
            element={note.name}
            position={{ x: note.x, y: note.y }}
            defaultPosition={{ x: note.x, y: note.y }}
            onStop={onControlledDragStop}
          >
            <ResizableBox
              onResize={onResize}
              element={note.name}
              className="box"
              style={{ zIndex: note.z_index }}
              width={note.width}
              height={note.height}
              onMouseOver={() => showOver(note)}
              onMouseOut={() => showOut(note)}
              minConstraints={[205, 255]}
              onClick={(e) => indexHandler(e, note)}
            >
              <div
                className='note'
                style={{ backgroundColor: note.active_color }}>
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
                        {!!note.textEdit ? 'save' : 'edit'}</Button>
                      <Button variant="success" className="delete" onClick={(e) => deleteHandler(e, note)}><X /></Button>
                    </div>
                  </div>}
                  <div className="note__content">
                    {note.textEdit &&
                      <textarea
                        className="note__text"
                        value={note.text}
                        name='text'
                        onChange={(e) => changeMarkdownHandler(e, note)}></textarea>
                    }
                    {!note.textEdit && <ReactMarkdown
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
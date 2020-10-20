import React, { useState } from 'react';
import { Note } from '../components/Note'

const style = {
  height: '600px',
  width: '600px',
  backgroundColor: '#a0f198',
  margin: '0 auto',
  marginTop: '160px',
  display: 'flex'
}

export const MainPage = () => {
  return (
    <>
      <div style={style}>
        <Note/>
      </div>
    </>
  )
}
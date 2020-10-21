import React, { useState, useCallback, useEffect } from 'react';
import { Note } from '../components/Note'
import { useHttp } from '../hooks/http.hook';
import { Loader } from '../components/Loader'

const style = {
  height: '600px',
  width: '600px',
  backgroundColor: '#a0f198',
  margin: '0 auto',
  marginTop: '160px',
  display: 'flex'
}

export const MainPage = () => {
  const { request, loading } = useHttp();
  const [fetchNotes, setFetchNotes]  = useState([]);

  // const getNotes = useCallback(async () => {
  //   try {
  //     const data = await request(`/api/notes`, 'GET', null);
  //     console.log(data)
  //     setFetchNotes(data);
  //   } catch (e) { }
  // }, [request]);

  // useEffect(() => {
  //   getNotes();
  // }, [getNotes]);


  if (loading) {
    return (
        <Loader />
    )
  }

  return (
    <>
      {fetchNotes && <div style={style}>
        <Note
          fetchNotes={fetchNotes}
          loading={loading}
        />
      </div>}
    </>
  )
}
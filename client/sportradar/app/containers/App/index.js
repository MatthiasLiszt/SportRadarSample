/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useState } from 'react';
import styled from 'styled-components';

import Data from 'containers/Data';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

let update = false;

export default function App() {
  const d = new Date();
  // let mDate = d.getMonth() + 1 + '-' + d.getDate() + '-' + d.getFullYear();
  let mDate = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
  let mTime = `${d.getHours()}:${d.getMinutes()}`;
  let team = ' ';
  let home = '-';
  let away = '-';
  let comment = ' ';
  const data = localStorage.getItem('lastMatches');
  const [count, Update] = useState(0);

  function fetchData() {
    // console.log('inputs '+mDate+' '+mTime);
    const DateTime = `${mDate} ${mTime}`;
    const ts = new Date(DateTime).getTime();
    // console.log('ts '+ ts);
    // console.log('fetching data from http://localhost:2777/last5matches');
    const cTeam = uC(team);
    const cComment = uC(comment);
    const params = `?ts=${ts}&team=${cTeam}&home=${home}&away=${away}&event=${cComment}`;
    const url = `http://localhost:2777/last5matches${params}`;
    fetch(url)
      .then(response => response.text())
      .then(response => {
        localStorage.setItem('lastMatches', response);
        update = true;
        Update(count + 1);
      });
  }

  function uC(x) {
    return x.replaceAll(/[^a-zA-Z]/g, '%20');
  }

  function setDate(event) {
    // console.log(event.target.value);
    mDate = event.target.value;
  }

  function setTime(event) {
    mTime = event.target.value;
  }

  function setHome(event) {
    home = event.target.value;
  }

  function setAway(event) {
    away = event.target.value;
  }

  function setTeam(event) {
    team = event.target.value;
  }

  function setComment(event) {
    comment = event.target.value;
  }

  function goBack() {
    update = false;
    Update(count + 1);
  }

  if (!update) {
    return (
      <AppWrapper>
        <h1>last five matches</h1>
        <input onChange={setDate} type="date" />
        <input onChange={setTime} type="time" />
        <input onChange={setTeam} type="text" placeholder="team" />
        <h3>score</h3>
        <input onChange={setHome} type="number" />
        <input onChange={setAway} type="number" />
        <h3>event</h3>
        <input onChange={setComment} type="text" placeholder="event" />
        <button type="button" onClick={fetchData}>
          submit
        </button>
      </AppWrapper>
    );
  }
  if (update) {
    return (
      <AppWrapper>
        <button type="button" onClick={goBack}>
          back
        </button>
        <Data data={data} />
      </AppWrapper>
    );
  }
}

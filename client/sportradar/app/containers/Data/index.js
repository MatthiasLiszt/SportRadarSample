/**
 *
 * Data
 *
 * used for displaying data
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DataWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function Data(props) {
  let data = [];
  let error = false;
  // console.log(props.data.substring(0,1024));
  try {
    data = JSON.parse(props.data);
    if (typeof data === 'object') {
      if (data[0].tid === undefined) {
        // console.log('data[0].tid does not exist and thus it is not a processible json');
        error = true;
      }
      if (data[0].lastMatches === undefined) {
        // console.log('data[0].lastMatches does not exist');
        error = true;
      } else {
        // data[0].lastMatches contains no matches
        error = data[0].lastMatches.length < 1;
      }
    } else {
      // console.log('data is not an object')
      error = true;
    }
  } catch (e) {
    // console.log('parsing json failed');
    // console.log(e);
    error = true;
  }

  if (error) {
    return (
      <DataWrapper>
        <p>Sorry, data could not be retrieved !</p>
      </DataWrapper>
    );
  }

  function null2minus(n) {
    if (n === undefined) {
      return '-';
    }
    return n === null ? '-' : n;
  }
  function isoDate(ts) {
    if (ts === undefined) {
      return '';
    }
    const d = new Date(ts * 1e3);
    const isoString = d
      .toISOString()
      .replace('T', ' ')
      .replace('Z', ' ');
    return isoString;
  }
  function optionalChaining(root, v) {
    return Object.keys(root).includes(v) ? root[v] : ' ';
  }
  let table = [];
  for (let x = 0; x < data.length; x += 1) {
    const tid = [<h1>{data[x].tid.name}</h1>];
    let rows = [];
    const fiveSmaller =
      data[x].lastMatches.length > 4 ? 5 : data[x].lastMatches.length;
    for (let y = 0; y < fiveSmaller; y += 1) {
      const mScore = `${null2minus(data[x].lastMatches[y].score.home)}:
        ${null2minus(data[x].lastMatches[y].score.away)}`;
      const row = [
        <table>
          <tr>
            <td>{isoDate(optionalChaining(data[x].lastMatches[y], 'ts'))}</td>
            <td>{optionalChaining(data[x].lastMatches[y], 'home')}</td>
            <td>{optionalChaining(data[x].lastMatches[y], 'away')}</td>
            <td>{mScore}</td>
            <td>{optionalChaining(data[x].lastMatches[y], 'event')}</td>
          </tr>
        </table>,
      ];
      rows = [...rows, ...row];
    }
    rows = [...tid, ...rows];
    table = [...table, ...rows];
  }
  return <DataWrapper>{table}</DataWrapper>;
}

Data.propTypes = {
  data: PropTypes.string,
};

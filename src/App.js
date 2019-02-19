import React, { Component } from 'react';
import moment from 'moment';
import * as rxjs from 'rxjs';
import { filter, repeat, delay, take } from 'rxjs/operators';
import mockedData from './mockedData';
import './App.css';

class App extends Component {

  componentDidMount = () => {
    // sort the response from end-point by startTime value
    const filteredByStartTime = mockedData.sort((a, b) => a.startTime - b.startTime);

    // create new Observable from the sorted array
    const events$ = rxjs.from(filteredByStartTime);

    // function for filtering EPG by current time
    const filterEPGByCurrentTime = event => event.startTime > Date.now();

    const upcoming$ = events$.pipe(
      // filtering
      filter(filterEPGByCurrentTime),
      // will take the first one of the result
      take(1),
      // each minute
      delay(30000),
      // repeat it again
      repeat(),
    );
    
    // subscribing for the events
    upcoming$.subscribe(val => console.log(`
      current time: ${moment().format('MMMM Do YYYY, h:mm:ss a')}
      current EPG: startTime: ${val.startTime} (Unix Millisecond Timestamp) and title: ${val.tvShow.title}
    `));
  }
  
  render() {    
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
      </div>
    );
  }
}

export default App;

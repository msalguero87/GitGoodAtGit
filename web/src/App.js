import React from 'react';
import './App.css';
import './console.css';
import Repository from './repository';
import Repositories from './RepositoryState';
import Console from './console';

function App() {
  return (
    <div className="App">
      <div className="card container">
        <div className="row">
          <div className="col s6">
          <div className='console'>
            <Console />
          </div>
          </div>
          <div className="col s6">
            <Repository repository={Repositories.remote} />
            <div className="divider"></div>
            <Repository repository={Repositories.local} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

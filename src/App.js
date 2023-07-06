import { Route, Switch } from 'react-router-dom';
import Header from './component/header/header';
import React, { Suspense } from 'react'
import appRoutes from './app-routes';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import indexDBService from './services/local-storage';
import { useState, useEffect } from 'react';
function App() {
  const [isDbInit, setDBInit] = useState(null)
  useEffect(() => {
    function initDB(isSuccess) {
      setDBInit(isSuccess)
    }
    // initialize
    indexDBService.open(initDB)
    return () => {
      // clear all
    }
  }, [])

  return (
    <div className="voice_main_wrapper">
      <Suspense fallback={<div />}>
        <ToastContainer />
        <Header />
        <Switch>
          {appRoutes.map(r => (
            <Route
              key={r.path}
              exact={r.exact}
              path={r.path}
              component={props => {
                return (
                  <r.component
                    {...props}
                    isDbInit={isDbInit}
                  />
                )
              }}
            />
          ))}
        </Switch>
      </Suspense>


    </div>
  );
}

export default App;

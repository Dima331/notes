import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {MainPage} from './pages/MainPage'

export const useRouters = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <MainPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
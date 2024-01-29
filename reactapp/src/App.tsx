import $ from 'jquery';
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './store/Store';
import { setCurrentUser, setPlaces, setTypes } from './store/MainSlice';
import Header from './components/Header/Header';
import LoginDialog from './components/LoginDialog/LoginDialog';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import './App.css';

export default function App() {
    const [loading, setLoading] = useState(true);
    const user = useAppSelector(state => state.main.currentUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        $.ajax('api/account/check', {
            method: 'GET',
            complete: () => setLoading(false),
            success: result => {
                dispatch(setCurrentUser(result));
            }
        });
    }, []);

    useEffect(() => {
        $.ajax('api/types', {
            method: 'GET',
            success: result => {
                dispatch(setTypes(result));
            }
        });
    }, []);

    useEffect(() => {
        $.ajax('api/calculations/places', {
            method: 'GET',
            success: result => {
                dispatch(setPlaces(result));
            }
        });
    }, []);

    return (
        <div>
            {loading ?
                <div className='loading-container'>
                    <LoadingIndicator />
                </div> :
                user === undefined ?
                    <LoginDialog /> :
                    <>
                        <Header />
                        <Outlet />
                    </>}
        </div>
    );
}
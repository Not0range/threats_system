import $ from 'jquery';
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from './store/Store';
import { setPlaces, setTypes } from './store/MainSlice';
import Header from './components/Header/Header';

export default function App() {
    const dispatch = useAppDispatch();
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
            <Header />
            <Outlet />
        </div>
    );
}
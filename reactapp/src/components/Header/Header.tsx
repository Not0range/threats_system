import $ from 'jquery';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../../store/Store';
import { setCurrentUser } from '../../store/MainSlice';
import './Header.css';
import HeaderButton from '../HeaderButton/HeaderButton';

export default function Header() {
    const user = useAppSelector(state => state.main.currentUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        $.ajax('api/account/check', {
            method: 'GET',
            success: result => {
                dispatch(setCurrentUser(result));
            }
        });
    }, []);
    return (
        <div className='main-header'>
            <HeaderButton text='Вход' />
        </div>
    )
}
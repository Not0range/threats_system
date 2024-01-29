import $ from 'jquery';
import { useAppDispatch, useAppSelector } from '../../store/Store';
import './Header.css';
import HeaderButton from '../MainButton/MainButton';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../../store/MainSlice';

export default function Header() {
    const navigate = useNavigate();
    const user = useAppSelector(state => state.main.currentUser);
    const dispatch = useAppDispatch();

    const doLogout = () => {
        $.ajax('/api/Account/Logout', {
            method: 'GET',
            success: () => {
                dispatch(setCurrentUser(undefined));
                navigate('/');
            }
        })
    };

    return (
        <div className='main-header'>
            <Link to={'/'}><img src='/logo192.png' /></Link>
            <div style={{flexGrow: 1}} />
            <h3>Здравствуйте, {user?.username}</h3>
            <HeaderButton text='Панель управления' onClick={() => navigate('admin')} />
            <HeaderButton text='Выход' onClick={doLogout} />
        </div>
    )
}
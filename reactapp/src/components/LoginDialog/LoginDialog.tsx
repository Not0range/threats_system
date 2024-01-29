import $ from 'jquery';
import { useState } from 'react';
import HeaderButton from '../MainButton/MainButton';
import TextInput from '../TextInput/TextInput';
import './LoginDialog.css';
import { useAppDispatch } from '../../store/Store';
import { setCurrentUser } from '../../store/MainSlice';

export default function LoginDialog() {
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const doLogin = () => {
        $.ajax('api/account/login', {
            method: 'POST',
            data: {
                username,
                password,
            },
            success: result => {
                dispatch(setCurrentUser(result));
            }
        })
    }

    return (
        <div className="dialog-overlay">
            <div className='dialog-window'>
                <h2>Вход</h2>
                <TextInput
                    placeholder='Имя пользователя'
                    value={username}
                    onChanged={setUsername}
                />
                <TextInput
                    placeholder='Пароль'
                    value={password}
                    onChanged={setPassword}
                    secure
                />
                <HeaderButton text='Войти' onClick={doLogin} />
            </div>
        </div>
    )
}
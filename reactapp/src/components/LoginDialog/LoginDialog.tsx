import $ from 'jquery';
import { useEffect, useState } from 'react';
import HeaderButton from '../MainButton/MainButton';
import TextInput from '../TextInput/TextInput';
import './LoginDialog.css';
import { useAppDispatch } from '../../store/Store';
import { setCurrentUser } from '../../store/MainSlice';
import Alert from '../Alert/Alert';

export default function LoginDialog() {
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
    }, [username, password]);

    const doLogin = () => {
        $.ajax('api/account/login', {
            method: 'POST',
            data: {
                username,
                password,
            },
            success: result => {
                dispatch(setCurrentUser(result));
            },
            error: () => {
                setError('Неверный логин и/или пароль');
            }
        })
    }

    return (
        <div className="login-dialog-overlay">
            <div className='login-dialog-window'>
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
                {error &&
                    <Alert
                        text={error}
                        type='error'
                    />}
                <HeaderButton text='Войти' onClick={doLogin} />
            </div>
        </div>
    )
}
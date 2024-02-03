import $ from 'jquery';
import { useEffect, useState } from "react"
import TextInput from "../../../../components/TextInput/TextInput";
import './PasswordChange.css';
import HeaderButton from "../../../../components/MainButton/MainButton";
import Alert from '../../../../components/Alert/Alert';

export default function PasswordChange() {
    const [old, setOld] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setSuccess('');
        setError('');
    }, [old, newPass, confirm]);

    const change = () => {
        if (newPass !== confirm) {
            setError('Новые пароли не совпадают')
            return;
        }
        $.ajax(`/api/Account/ChangePassword`, {
            method: 'POST',
            data: JSON.stringify({
                oldPassword: old,
                newPassword: newPass
            }),
            contentType: 'application/json',
            processData: false,
            success: () => {
                setOld('');
                setNewPass('');
                setConfirm('');
                setTimeout(() => setSuccess('Пароль успешно изменён'), 0);
            },
            error: () => {
                setError('Старый пароль введён неверно');
            }
        });
    };

    return (
        <div className="password-change-container">
            <TextInput
                value={old}
                onChanged={setOld}
                placeholder="Старый пароль"
                secure
            />
            <TextInput
                value={newPass}
                onChanged={setNewPass}
                placeholder="Новый пароль"
                secure
            />
            <TextInput
                value={confirm}
                onChanged={setConfirm}
                placeholder="Подтвердить пароль"
                secure
            />
            {success && <Alert text={success} type='success' />}
            {error && <Alert text={error} type='error' />}
            <HeaderButton text="Сменить пароль" onClick={change} />
        </div>
    )
}
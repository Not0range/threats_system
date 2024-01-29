import $ from 'jquery';
import { useState } from "react"
import TextInput from "../../../../components/TextInput/TextInput";
import './PasswordChange.css';
import HeaderButton from "../../../../components/MainButton/MainButton";

export default function PasswordChange() {
    const [old, setOld] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirm, setConfirm] = useState('');

    const change = () => {

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
            <HeaderButton text="Сменить пароль" onClick={change} />
        </div>
    )
}
import $ from 'jquery';
import { useEffect, useState } from "react";
import DataPage from "../../../../components/DataPage/DataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { User } from "../../../../models/User";
import ComboBox from '../../../../components/ComboBox/ComboBox';
import MainDialog from '../../../../components/MainDialog/MainDialog';
import MainButton from '../../../../components/MainButton/MainButton';
import { useAppSelector } from '../../../../store/Store';

export default function UsersPage() {
    const current = useAppSelector(state => state.main.currentUser);
    const [users, setUsers] = useState<User[]>([]);

    const [password, setPassword] = useState('');

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);

    const [id, setId] = useState<number | undefined>(undefined);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [role, setRole] = useState(2);

    useEffect(() => {
        refresh();
    }, []);

    const refresh = () => {
        $.ajax('/api/Account/List', {
            method: 'GET',
            success: result => {
                setUsers(result);
            }
        });
    };

    const add = () => {
        if (!username || !name || !position) return;

        $.ajax('/api/Account/Create', {
            method: 'POST',
            data: JSON.stringify({
                username,
                name,
                position,
                role
            }),
            contentType: 'application/json',
            processData: false,
            success: result => {
                refresh();
                setPassword(result.password);
                cancel();
            }
        });
    };

    const save = () => {
        if (!username || !name || !position) return;

        $.ajax(`/api/Account/Edit/${id}`, {
            method: 'POST',
            data: JSON.stringify({
                name,
                position,
                role
            }),
            contentType: 'application/json',
            processData: false,
            success: () => {
                refresh();
                cancel();
            }
        });
    };

    const edit = (item: User) => {
        setId(item.id);
        setUsername(item.username);
        setName(item.name);
        setPosition(item.position);
        setRole(item.role);
        setCreating(true);
    }

    const cancel = () => {
        setCreating(false);
        setId(undefined);
        setUsername('');
        setName('');
        setPosition('');
        setRole(2);
    }

    const reset = () => {
        $.ajax(`/api/Account/ResetPassword/${id}`, {
            method: 'GET',
            contentType: 'application/json',
            processData: false,
            success: result => {
                refresh();
                setPassword(result.password);
                cancel();
            }
        });
    }

    return (
        <div>
            <DataPage<User>
                creating={creating}
                page={page}
                setCreating={setCreating}
                setPage={setPage}
                onSaved={() => {
                    if (id) save();
                    else add();
                }}
                onCancel={cancel}
                onEdit={edit}
                creatingChildren={
                    <>
                        <TextInput
                            placeholder="Имя пользователя"
                            value={username}
                            onChanged={setUsername}
                            disabled={id !== undefined}
                        />
                        <TextInput
                            placeholder="ФИО"
                            value={name}
                            onChanged={setName}
                        />
                        <TextInput
                            placeholder="Должность"
                            value={position}
                            onChanged={setPosition}
                        />
                        <ComboBox
                            placeholder='Права доступа'
                            value={role}
                            onChanged={setRole}
                            items={[
                                { key: 0, value: 'Администратор' },
                                { key: 1, value: 'Оператор' },
                                { key: 2, value: 'Пользователь' },
                            ]}
                            disabled={id !== undefined}
                        />
                        {id && id !== current?.id &&
                            <MainButton
                                text='Сбросить пароль'
                                onClick={reset}
                            />}
                    </>
                }
                items={users}
                keySelector={(e) => `t${e.id}`}
                titleSelector={(e) => e.username}
            />
            {password && <MainDialog
                title='Новый пароль'
                text={`Пароль: ${password}. 
                Его необходимо сменить при первом входе в систему.`}
                onCancel={() => setPassword('')}
            />}
        </div>
    );
}
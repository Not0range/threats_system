import $ from 'jquery';
import { useEffect, useState } from "react";
import DataPage from "../../../../components/DataPage/DataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { User } from "../../../../models/User";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');

    useEffect(() => {
        $.ajax('/api/Account/List', {
            method: 'GET',
            success: result => {
                setUsers(result);
            }
        });
    }, []);

    const cancel = () => {
        setCreating(false);
        setUsername('');
        setName('');
        setPosition('');
    }

    return (
        <DataPage<User>
            creating={creating}
            page={page}
            setCreating={setCreating}
            setPage={setPage}
            onCancel={cancel}
            onEdit={() => {}}
            onDelete={() => {}}
            creatingChildren={
                <>
                    <TextInput
                        placeholder="Имя пользователя"
                        value={username}
                        onChanged={setUsername}
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
                </>
            }
            items={users}
            keySelector={(e) => `t${e.id}`}
            titleSelector={(e) => e.username}
        />
    );
}
import $ from 'jquery';
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/Store";
import DataPage from "../../../../components/DataPage/DataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { ThreatType } from "../../../../models/ThreatType";
import NumberInput from "../../../../components/NumberField/NumberInput";
import { setTypes } from "../../../../store/MainSlice";
import MainDialog from '../../../../components/MainDialog/MainDialog';

export default function TypesPage() {
    const types = useAppSelector(state => state.main.types);
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);
    const [remove, setRemove] = useState<number | undefined>(undefined);

    const [id, setId] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [level, setLevel] = useState(1);

    const refresh = () => {
        $.ajax('api/types', {
            method: 'GET',
            success: result => {
                dispatch(setTypes(result));
                cancel();
            }
        });
    };

    const add = () => {
        if (!title) return;

        $.ajax('/api/types', {
            method: 'PUT',
            data: JSON.stringify({
                title,
                level
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const save = () => {
        if (!title) return;

        $.ajax(`/api/types/${id}`, {
            method: 'POST',
            data: JSON.stringify({
                title,
                level
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const deleteItem = () => {
        $.ajax(`/api/types/${remove}`, {
            method: 'DELETE',
            success: () => {
                setRemove(undefined);
                refresh(); 
            }
        });
    };

    const edit = (item: ThreatType) => {
        setId(item.id);
        setTitle(item.title);
        setLevel(item.level);
        setCreating(true);
    }

    const cancel = () => {
        setCreating(false);
        setId(undefined);
        setTitle('');
        setLevel(1);
    }

    return (
        <div>
            <DataPage<ThreatType>
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
                onDelete={(e) => setRemove(e.id)}
                creatingChildren={
                    <>
                        <TextInput
                            placeholder="Наименование типа угрозы"
                            value={title}
                            onChanged={setTitle}
                        />
                        <NumberInput
                            placeholder="Уровень угрозы"
                            value={level}
                            onChanged={setLevel}
                        />
                    </>
                }
                items={types}
                keySelector={(e) => `t${e.id}`}
                titleSelector={(e) => e.title}
            />
            {remove && <MainDialog
                title='Удаление'
                text='Вы действительно желаете удалить выбранную запись?'
                onConfirm={deleteItem}
                onCancel={() => setRemove(undefined)}
            />}
        </div>
    );
}
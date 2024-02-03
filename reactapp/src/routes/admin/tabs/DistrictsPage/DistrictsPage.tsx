import $ from 'jquery';
import { useState } from "react";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { useAppDispatch, useAppSelector } from "../../../../store/Store";
import { DistrictInfo } from "../../../../models/PlaceModels";
import { setPlaces } from '../../../../store/MainSlice';
import Alert from '../../../../components/Alert/Alert';
import MainDialog from '../../../../components/MainDialog/MainDialog';

export default function DistrictsPage() {
    const districts = useAppSelector(state => state.main.places);
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);
    const [remove, setRemove] = useState<number | undefined>(undefined);

    const [id, setId] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [svg, setSvg] = useState<string | undefined>(undefined);

    const refresh = () => {
        $.ajax('api/calculations/places', {
            method: 'GET',
            success: result => {
                dispatch(setPlaces(result));
                cancel();
            }
        });
    };

    const add = () => {
        if (!title || !svg) return;

        $.ajax('/api/districts', {
            method: 'PUT',
            data: JSON.stringify({
                title,
                svgTag: svg
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const save = () => {
        if (!title || !svg) return;

        $.ajax(`/api/districts/${id}`, {
            method: 'POST',
            data: JSON.stringify({
                title,
                svgTag: svg
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const deleteItem = () => {
        $.ajax(`/api/districts/${remove}`, {
            method: 'DELETE',
            success: () => {
                setRemove(undefined);
                refresh(); 
            }
        });
    };

    const edit = (item: DistrictInfo) => {
        setId(item.id);
        setTitle(item.title);
        setSvg(item.svgTag);
        setCreating(true);
    }

    const cancel = () => {
        setCreating(false);
        setId(undefined);
        setTitle('');
        setSvg(undefined);
    }

    const mapSelect = (tag?: string) => {
        if (creating && tag) setSvg(tag);
    }

    return (
        <div>
            <MapDataPage<DistrictInfo>
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
                            placeholder="Наименование района"
                            value={title}
                            onChanged={setTitle}
                        />
                        {!svg && <Alert
                            text='Выберите местоположение района на карте'
                            type='warning'
                        />}
                    </>
                }
                items={districts}
                keySelector={(e) => `d${e.id}`}
                titleSelector={(e) => e.title}
                selected={svg}
                onSelected={mapSelect}
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
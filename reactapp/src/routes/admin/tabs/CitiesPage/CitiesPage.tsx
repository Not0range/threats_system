import $ from 'jquery';
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/Store";
import { CityInfo } from "../../../../models/PlaceModels";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { setPlaces } from '../../../../store/MainSlice';
import MainDialog from '../../../../components/MainDialog/MainDialog';
import Alert from '../../../../components/Alert/Alert';

export default function CitiesPage() {
    const [filter, setFilter] = useState<string | undefined>(undefined);

    const districts = useAppSelector(state => state.main.places);
    const cities = useMemo(() => {
        if (filter !== undefined) {
            return districts.find(t => t.svgTag === filter)?.cities ?? [];
        }
        return districts.reduce<CityInfo[]>((p, c) => {
            p.push(...c.cities);
            return p;
        }, []);
    }, [districts, filter]);
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);
    const [remove, setRemove] = useState<number | undefined>(undefined);

    const [id, setId] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [svg, setSvg] = useState<string | undefined>(undefined);
    const [zoomed, setZoomed] = useState<string | undefined>(undefined);

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
        const d = districts.find((e) => e.svgTag === zoomed) ??
            districts.find((e) => e.svgTag === svg);
        if (!d || !title || !svg) return;

        $.ajax('/api/cities', {
            method: 'PUT',
            data: JSON.stringify({
                title,
                districtId: d.id,
                svgTag: svg
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const save = () => {
        const d = districts.find((e) => e.svgTag === zoomed) ??
            districts.find((e) => e.svgTag === svg);
        if (!d || !title || !svg) return;

        $.ajax(`/api/cities/${id}`, {
            method: 'POST',
            data: JSON.stringify({
                title,
                districtId: d.id,
                svgTag: svg
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const deleteItem = () => {
        $.ajax(`/api/cities/${remove}`, {
            method: 'DELETE',
            success: () => {
                setRemove(undefined);
                refresh();
            }
        });
    };

    const edit = (item: CityInfo) => {
        setId(item.id);
        setTitle(item.title);
        setSvg(item.svgTag);
        setCreating(true);
        setZoomed(districts.find(t => t.id == item.districtId)?.svgTag);
    }

    const cancel = () => {
        setCreating(false);
        setId(undefined);
        setTitle('');
        setSvg(undefined);
        setZoomed(undefined);
    }

    const mapSelect = (tag?: string, s?: boolean) => {
        if (creating) {
            if (zoomed) {
                if (tag) setSvg(tag);
                else setZoomed(undefined);
            } else if (tag) {
                if (s) setSvg(tag);
                else setZoomed(tag);
            }
        } else {
            if (tag) setFilter(tag);
            else setFilter(undefined);
        }
    }

    return (
        <div>
            <MapDataPage<CityInfo>
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
                            placeholder="Наименование города"
                            value={title}
                            onChanged={setTitle}
                        />
                        {!svg && <Alert
                            text='Выберите местоположение района на карте'
                            type='warning'
                        />}
                    </>
                }
                items={cities}
                keySelector={(e) => `c${e.id}`}
                titleSelector={(e) => e.title}
                selected={creating ? svg : filter}
                onSelected={mapSelect}
                zoomed={zoomed}
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
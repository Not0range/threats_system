import $ from 'jquery';
import { useMemo, useState } from "react";
import { CityInfo, MicrodistrictInfo } from "../../../../models/PlaceModels";
import { useAppDispatch, useAppSelector } from "../../../../store/Store";
import TextInput from "../../../../components/TextInput/TextInput";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import { setPlaces } from '../../../../store/MainSlice';
import Alert from '../../../../components/Alert/Alert';
import MainDialog from '../../../../components/MainDialog/MainDialog';

export default function MicrodistrictsPage() {
    const [filterD, setFilterD] = useState<string | undefined>(undefined);
    const [filterC, setFilterC] = useState<string | undefined>(undefined);
    
    const [creating, setCreating] = useState(false);

    const districts = useAppSelector(state => state.main.places);
    const cities = useMemo(() => {
        if (!creating && filterD !== undefined) {
            return districts.find(t => t.svgTag === filterD)?.cities ?? [];
        }
        return districts.reduce<CityInfo[]>((p, c) => {
            p.push(...c.cities);
            return p;
        }, []);
    }, [districts, filterD, creating]);
    const microdistricts = useMemo(() => {
        if (filterC !== undefined) {
            return cities.find(t => t.svgTag === filterC)?.microdistricts ?? [];
        }
        return cities.reduce<MicrodistrictInfo[]>((p, c) => {
            p.push(...c.microdistricts);
            return p;
        }, []);
    }, [cities, filterC]);
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    const [remove, setRemove] = useState<number | undefined>(undefined);

    const [id, setId] = useState<number | undefined>(undefined);
    const [title, setTitle] = useState('');
    const [svg, setSvg] = useState<string | undefined>(undefined);
    const [zoomedD, setZoomedD] = useState<string | undefined>(undefined);
    const [zoomedC, setZoomedC] = useState<string | undefined>(undefined);

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
        const c = cities.find((e) => e.svgTag === zoomedC);
        if (!c || !title || !svg) return;

        $.ajax('/api/microdistricts', {
            method: 'PUT',
            data: JSON.stringify({
                title,
                cityId: c.id,
                svgTag: svg
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const save = () => {
        const c = cities.find((e) => e.svgTag === zoomedC);
        if (!c || !title || !svg) return;

        $.ajax(`/api/microdistricts/${id}`, {
            method: 'POST',
            data: JSON.stringify({
                title,
                cityId: c.id,
                svgTag: svg
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const deleteItem = () => {
        $.ajax(`/api/microdistricts/${remove}`, {
            method: 'DELETE',
            success: () => {
                setRemove(undefined);
                refresh();
            }
        });
    };

    const edit = (item: MicrodistrictInfo) => {
        setId(item.id);
        setTitle(item.title);
        setSvg(item.svgTag);
        setCreating(true);

        const city = cities.find(t => t.id == item.cityId);

        setZoomedD(districts.find(t => t.id == city?.districtId)?.svgTag);
        setZoomedC(city?.svgTag);
    };

    const cancel = () => {
        setCreating(false);
        setId(undefined);
        setTitle('');
        setSvg(undefined);
        setZoomedD(undefined);
        setZoomedC(undefined);
    };

    const mapSelect = (tag?: string, s?: boolean) => {
        if (creating) {
            if (zoomedC) {
                if (tag) setSvg(tag);
                else setZoomedC(undefined);
            } else if (zoomedD) {
                if (tag) setZoomedC(tag);
                else setZoomedD(undefined);
            } else if (tag) {
                if (s) {
                    setZoomedD(tag);
                    setZoomedC(tag);
                }
                else setZoomedD(tag);
            }
        } else {
            if (tag) {
                if (s) {
                    setFilterD(tag);
                    setFilterC(tag);
                    return;
                }

                if (filterD) setFilterC(tag);
                else setFilterD(tag);
            }
            else {
                if (filterC) setFilterC(undefined);
                else setFilterD(undefined);
            }
        }
    }

    return (
        <div>
            <MapDataPage<MicrodistrictInfo>
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
                            placeholder="Наименование микрорайона"
                            value={title}
                            onChanged={setTitle}
                        />
                        {!svg && <Alert
                            text='Выберите местоположение района на карте'
                            type='warning'
                        />}
                    </>
                }
                items={microdistricts}
                keySelector={(e) => `m${e.id}`}
                titleSelector={(e) => e.title}
                selected={creating ? svg : filterC ?? filterD}
                onSelected={mapSelect}
                zoomed={creating ? zoomedC ?? zoomedD : filterD}
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
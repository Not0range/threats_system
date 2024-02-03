import $ from 'jquery';
import { useEffect, useMemo, useState } from "react";
import TextInput from "../../../../components/TextInput/TextInput";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import { SingleThreat } from "../../../../models/SingleThreat";
import { useAppSelector } from '../../../../store/Store';
import MainDialog from '../../../../components/MainDialog/MainDialog';
import ComboBox from '../../../../components/ComboBox/ComboBox';
import DateTimeInput from '../../../../components/DateTimeInput/DateTimeInput';
import Alert from '../../../../components/Alert/Alert';
import { CityInfo, MicrodistrictInfo } from '../../../../models/PlaceModels';
import moment from 'moment';

export default function ThreatsPage() {
    const types = useAppSelector(state => state.main.types);
    const [threats, setThreats] = useState<SingleThreat[]>([]);

    const districts = useAppSelector(state => state.main.places);
    const cities = useMemo(() => {
        return districts.reduce<CityInfo[]>((p, c) => {
            p.push(...c.cities);
            return p;
        }, []);
    }, [districts]);
    const microdistricts = useMemo(() => {
        return cities.reduce<MicrodistrictInfo[]>((p, c) => {
            p.push(...c.microdistricts);
            return p;
        }, []);
    }, [cities]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [creating, setCreating] = useState(false);
    const [remove, setRemove] = useState<number | undefined>(undefined);

    const [type, setType] = useState(types[0].id);
    const [date, setDate] = useState<Date | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [svg, setSvg] = useState<string | undefined>(undefined);
    const [zoomedD, setZoomedD] = useState<string | undefined>(undefined);
    const [zoomedC, setZoomedC] = useState<string | undefined>(undefined);

    const refresh = () => {
        $.ajax('/api/Threats', {
            method: 'GET',
            data: { page },
            success: result => {
                setThreats(result.result);
                setTotal(result.totalPages);
                cancel();
            }
        });
    }

    useEffect(() => {
        refresh();
    }, [page]);

    const add = () => {
        const m = microdistricts.find((e) => e.svgTag === svg);
        if (!m || !date) return;

        $.ajax('/api/Threats', {
            method: 'PUT',
            data: JSON.stringify({
                typeId: type,
                microdistrictId: m.id,
                dateTime: date,
                name: name ? name : null,
                phone: phone ? phone : null,
                address: address ? address : null
            }),
            contentType: 'application/json',
            processData: false,
            success: () => refresh()
        });
    };

    const deleteItem = () => {
        $.ajax(`/api/Threats/${remove}`, {
            method: 'DELETE',
            success: () => {
                setRemove(undefined);
                refresh();
            }
        });
    };

    const cancel = () => {
        setCreating(false);
        setType(types[0].id);
        setDate(null);
        setName('');
        setPhone('');
        setAddress('');
        setSvg(undefined);
        setZoomedD(undefined);
        setZoomedC(undefined);
    }

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
            // if (tag) {
            //     if (s) {
            //         setFilterD(tag);
            //         setFilterC(tag);
            //         return;
            //     }

            //     if (filterD) setFilterC(tag);
            //     else setFilterD(tag);
            // }
            // else {
            //     if (filterC) setFilterC(undefined);
            //     else setFilterD(undefined);
            // }
        }
    }

    return (
        <div>
            <MapDataPage<SingleThreat>
                creating={creating}
                page={page}
                setCreating={setCreating}
                setPage={setPage}
                totalPages={total}
                onSaved={add}
                onCancel={cancel}
                onDelete={(e) => setRemove(e.id)}
                creatingChildren={
                    <>
                        <ComboBox
                            placeholder='Тип угрозы'
                            value={type}
                            onChanged={setType}
                            items={types.map(t => ({ key: t.id, value: t.title }))}
                        />
                        <DateTimeInput
                            onChanged={setDate}
                            placeholder='Дата и время'
                        />
                        <TextInput
                            placeholder="ФИО"
                            value={name}
                            onChanged={setName}
                        />
                        <TextInput
                            placeholder="Телефон"
                            value={phone}
                            onChanged={setPhone}
                        />
                        <TextInput
                            placeholder="Адрес"
                            value={address}
                            onChanged={setAddress}
                        />
                        {!svg && <Alert
                            text='Выберите местоположение района на карте'
                            type='warning'
                        />}
                    </>
                }
                items={threats}
                keySelector={(e) => `c${e.id}`}
                titleSelector={(e) => `${e.type.title} - ${e.place.cityTitle} - ${moment(e.dateTime).utc().format('DD.MM.y HH:mm')}`}
                selected={creating ? svg : undefined}
                onSelected={mapSelect}
                zoomed={creating ? zoomedC ?? zoomedD : undefined}
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
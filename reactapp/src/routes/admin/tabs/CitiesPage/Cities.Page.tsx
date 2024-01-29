import { useMemo, useState } from "react";
import { useAppSelector } from "../../../../store/Store";
import { CityInfo } from "../../../../models/PlaceModels";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import TextInput from "../../../../components/TextInput/TextInput";

export default function CitiesPage() {
    const districts = useAppSelector(state => state.main.places);
    const cities = useMemo(() => {
        return districts.reduce<CityInfo[]>((p, c) => {
            p.push(...c.cities); 
            return p;
        }, []);
    }, [districts]);

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState('');

    const cancel = () => {
        setCreating(false);
        setTitle('');
    }
    
    return (
        <MapDataPage<CityInfo>
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
                        placeholder="Наименование города"
                        value={title}
                        onChanged={setTitle}
                    />
                </>
            }
            items={cities}
            keySelector={(e) => `c${e.id}`}
            titleSelector={(e) => e.title}
        />
    );
}
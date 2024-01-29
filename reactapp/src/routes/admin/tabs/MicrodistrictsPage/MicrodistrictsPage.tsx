import { useMemo, useState } from "react";
import { MicrodistrictInfo } from "../../../../models/PlaceModels";
import { useAppSelector } from "../../../../store/Store";
import TextInput from "../../../../components/TextInput/TextInput";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";

export default function MicrodistrictsPage() {
    const districts = useAppSelector(state => state.main.places);
    const microdistricts = useMemo(() => {
        return districts.reduce<MicrodistrictInfo[]>((p, c) => {
            const m = c.cities.reduce<MicrodistrictInfo[]>((p, c) => {
                p.push(...c.microdistricts);
                return p;
            }, []);
            p.push(...m);
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
        <MapDataPage<MicrodistrictInfo>
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
                        placeholder="Наименование микрорайона"
                        value={title}
                        onChanged={setTitle}
                    />
                </>
            }
            items={microdistricts}
            keySelector={(e) => `c${e.id}`}
            titleSelector={(e) => e.title}
        />
    );
}
import { useState } from "react";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { useAppSelector } from "../../../../store/Store";
import { DistrictInfo } from "../../../../models/PlaceModels";

export default function DistrictsPage() {
    const districts = useAppSelector(state => state.main.places);

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState('');

    const cancel = () => {
        setCreating(false);
        setTitle('');
    }

    return (
        <MapDataPage<DistrictInfo>
            creating={creating}
            page={page}
            setCreating={setCreating}
            setPage={setPage}
            onCancel={cancel}
            onEdit={() => { }}
            onDelete={() => { }}
            creatingChildren={
                <>
                    <TextInput
                        placeholder="Наименование района"
                        value={title}
                        onChanged={setTitle}
                    />
                </>
            }
            items={districts}
            keySelector={(e) => `d${e.id}`}
            titleSelector={(e) => e.title}
        />
    );
}
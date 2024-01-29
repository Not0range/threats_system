import $ from 'jquery';
import { useEffect, useState } from "react";
import TextInput from "../../../../components/TextInput/TextInput";
import MapDataPage from "../../../../components/MapDataPage/MapDataPage";
import { SingleThreat } from "../../../../models/SingleThreat";

export default function ThreatsPage() {
    const [threats, setThreats] = useState<SingleThreat[]>([]);

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const [creating, setCreating] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        // setThreats([]);
        $.ajax('/api/Threats', {
            method: 'GET',
            data: { page },
            success: result => {
                setThreats(result.result);
                setTotal(result.totalPages)
            }
        });
    }, [page]);

    const cancel = () => {
        setCreating(false);
    }

    return (
        <MapDataPage<SingleThreat>
            creating={creating}
            page={page}
            setCreating={setCreating}
            setPage={setPage}
            totalPages={total}
            onCancel={cancel}
            onDelete={() => {}}
            creatingChildren={
                <>
                    {/* <TextInput
                        placeholder="Наименование"
                        value={title}
                        onChanged={setTitle}
                    /> */}
                </>
            }
            items={threats}
            keySelector={(e) => `c${e.id}`}
            titleSelector={(e) => `${e.type.title} - ${e.place.cityTitle} - ${e.dateTime}`}
        />
    );
}
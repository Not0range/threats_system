import { useState } from "react";
import { useAppSelector } from "../../../../store/Store";
import DataPage from "../../../../components/DataPage/DataPage";
import TextInput from "../../../../components/TextInput/TextInput";
import { ThreatType } from "../../../../models/ThreatType";
import NumberInput from "../../../../components/NumberField/NumberInput";

export default function TypesPage() {
    const types = useAppSelector(state => state.main.types);

    const [page, setPage] = useState(1);
    const [creating, setCreating] = useState(false);

    const [title, setTitle] = useState('');
    const [level, setLevel] = useState(1);

    const cancel = () => {
        setCreating(false);
        setTitle('');
        setLevel(1);
    }

    return (
        <DataPage<ThreatType>
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
    );
}
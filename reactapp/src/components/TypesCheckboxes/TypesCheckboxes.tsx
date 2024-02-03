import { setActive } from "../../store/MainSlice";
import { useAppDispatch, useAppSelector } from "../../store/Store";
import './TypesCheckboxes.css';

export default function TypesCheckboxes() {
    const types = useAppSelector(state => state.main.types);
    const active = useAppSelector(state => state.main.activeTypes);
    const dispatch = useAppDispatch();

    const click = (index: number, active: boolean) => {
        dispatch(setActive({index, active}))
    }

    return (
        <div className="checkboxes-container">
            {types.map((e, i) => <div key={`tcb${e.id}`} onClick={() => click(i, !active[i])}>
                <input
                    type="checkbox"
                    checked={active[i]}
                    onChange={e => click(i, e.target.checked)}
                />
                {e.title}
            </div>)}
        </div>);
}
import { useMemo } from 'react';
import MainButton from '../MainButton/MainButton';
import './DataPage.css';
import PageControl from '../PageControl/PageControl';
import MapSection from '../MapSection/MapSection';

const itemPerPage = 20;

export default function DataPage<T>(props: IProps<T>) {
    const listTop = useMemo(() => (<div className='data-page-top'>
        <MainButton
            text='Добавить'
            onClick={() => props.setCreating &&
                props.setCreating(true)}
        />
    </div>), [props.setCreating]);

    const creatingTop = useMemo(() => (<div className='data-page-top-c'>
        <MainButton
            text='Сохранить'
            onClick={() => props.onSaved && props.onSaved()}
        />
        <MainButton
            text='Отмена'
            onClick={() => props.onCancel && props.onCancel()}
        />
    </div>), [props.onSaved, props.onCancel]);

    const items = props.items.map((e) =>
        itemBuilder(props.keySelector(e),
            props.titleSelector(e),
            props.onEdit ?
                () => props.onEdit && props.onEdit(e) :
                undefined,
            props.onDelete ?
                () => props.onDelete && props.onDelete(e) :
                undefined));

    return (
        <div className="data-page">
            {!props.creating ?
                <div className='data-page-list'>
                    {listTop}
                    {items.slice((props.page - 1) * itemPerPage, props.page * itemPerPage)}
                    <PageControl
                        page={props.page}
                        setPage={props.setPage}
                        max={Math.ceil(items.length / itemPerPage)}
                    />
                </div> :
                <div className='data-page-list'>
                    {creatingTop}
                    {props.creatingChildren}
                </div>}
        </div>
    )
}

function itemBuilder(key: string, text: string, onEdit?: () => void, onDelete?: () => void) {
    return (
        <div key={key} className='data-page-item'>
            <div>{text}</div>
            {onEdit && <i
                className='bx bx-edit-alt bx-sm'
                onClick={onEdit}
            />}
            {onDelete && <i
                className='bx bx-trash bx-sm'
                onClick={onDelete}
            />}
        </div>
    );
}

interface IProps<T> {
    creating: boolean;
    page: number;
    setPage?: (value: number) => void;
    setCreating?: (value: boolean) => void;
    onSaved?: () => void;
    onCancel?: () => void;
    items: T[];
    keySelector: (value: T) => string;
    titleSelector: (value: T) => string;
    onEdit?: (value: T) => void;
    onDelete?: (value: T) => void;
    creatingChildren: React.ReactNode;
}
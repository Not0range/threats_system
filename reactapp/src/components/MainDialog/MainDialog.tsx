import MainButton from "../MainButton/MainButton";
import './MainDialog.css';

export default function MainDialog(props: IProps) {
    const close = (e: any) => {
        if (e.target.classList.contains('main-dialog-overlay') && props.onCancel)
            props.onCancel();
    };

    return (<div className="main-dialog-overlay" onClick={close}>
        <div className="main-dialog-window">
            <h2>{props.title}</h2>
            <h3>{props.text}</h3>
            {props.onConfirm && props.onCancel ?
                <div className="main-dialog-buttons">
                    <MainButton text="Да" onClick={props.onConfirm} />
                    <MainButton text="Нет" onClick={props.onCancel} />
                </div> : <MainButton text="Ок" onClick={props.onCancel} />}
        </div>
    </div>)
}

interface IProps {
    title: string;
    text: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}
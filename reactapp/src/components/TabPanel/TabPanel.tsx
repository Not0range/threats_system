import './TabPanel.css';

export default function TabPanel(props: IProps) {
    const click = (i: number) => {
        if (props.onTabChanged) props.onTabChanged(i);
    }
    return (<div className='tab-panel'>
        {props.titles.map((t, i) =>
            <div
                key={i}
                className={i == props.index ? 'selected' : ''}
                onClick={() => click(i)}
            >
                {t}
            </div>)}
    </div>);
}

interface IProps {
    titles: string[];
    index: number;
    onTabChanged?: (tab: number) => void
}
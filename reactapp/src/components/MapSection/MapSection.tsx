import $ from 'jquery';
import { useEffect } from 'react';
import './MapSection.css';

export default function MapSection(props: IProps) {
    useEffect(() => {
        if (props.selected) {
            const embed = $('#map-object').contents();
            const elem = embed.find(`#${props.selected}`);
            elem.addClass('selected');
            return () => { elem.removeClass('selected') };
        }
    }, [props.selected]);

    useEffect(() => {
        const embed = $('#map-object').contents();
        embed.on('click', onClick);
        return () => { embed.off('click') };
    }, [props.onSelected]);

    useEffect(() => {
        const embed = $('#map-object').contents();
        if (!props.zoomed) {
            embed.find('g').addClass('hidden');
            embed.find('#Rayony').removeClass('hidden');
            return;
        }
        embed.find('g').addClass('hidden');
        embed.find(`.${props.zoomed}`).removeClass('hidden');
        return () => { embed.find('g').removeClass('hidden') };
    }, [props.zoomed]);

    const onClick = (e: any) => {
        if (props.onSelected) {
            if (e.target.nodeName !== 'path')
                props.onSelected(undefined);
            else {
                const s = e.target.classList.contains('city-dist');
                props.onSelected(e.target.id, s);
            }
        }
    }

    const onLoad = () => {
        const embed = $('#map-object').contents();
        embed.on('click', onClick);
        if (props.selected) {
            const elem = embed.find(`#${props.selected}`);
            elem.addClass('selected');
        }
        if (!props.zoomed) {
            embed.find('g').addClass('hidden');
            embed.find('#Rayony').removeClass('hidden');
        } else {
            embed.find('g').addClass('hidden');
            embed.find(`.${props.zoomed}`).removeClass('hidden');
        }
    };

    return (
        <div className='map-section-container'>
            <object
                id='map-object'
                type='image/svg+xml'
                data='map.svg'
                onLoad={onLoad}
            />
        </div>
    )
}

interface IProps {
    selected?: string;
    onSelected?: (tag?: string, special?: boolean) => void;
    zoomed?: string;
}
export interface DistrictInfo {
    id: number;
    title: SVGStringList;
    svgTaag: string;
    cities: CityInfo[];
}

export interface CityInfo {
    id: number;
    title: SVGStringList;
    svgTaag: string;
    microdisstricts: MicrodistrictInfo[];
}

export interface MicrodistrictInfo {
    id: number;
    title: SVGStringList;
    svgTaag: string;
}
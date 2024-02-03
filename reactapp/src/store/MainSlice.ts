import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ThreatType } from "../models/ThreatType";
import { User } from "../models/User";
import { DistrictInfo } from "../models/PlaceModels";

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        types: [],
        loading: true,
        places: [],
        activeTypes: []
    } as IState,
    reducers: {
        setTypes: (state, action: PayloadAction<ThreatType[]>) => {
            state.types = action.payload;
            state.activeTypes = action.payload.map(e => true);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setCurrentUser: (state, action: PayloadAction<User | undefined>) => {
            state.currentUser = action.payload;
        },
        setPlaces: (state, action: PayloadAction<DistrictInfo[]>) => {
            state.places = action.payload;
        },
        setActive: (state, action: PayloadAction<{index: number, active: boolean}>) => {
            state.activeTypes[action.payload.index] = action.payload.active;
        }
    }
});

interface IState {
    types: ThreatType[];
    currentUser?: User;
    loading: boolean;
    places: DistrictInfo[];
    activeTypes: boolean[];
}

export const { setTypes, setLoading, setCurrentUser, setPlaces, setActive } = mainSlice.actions;
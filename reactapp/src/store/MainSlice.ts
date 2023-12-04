import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ThreatType } from "../models/ThreatType";
import { User } from "../models/User";
import { DistrictInfo } from "../models/PlaceModels";

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        types: [],
        loading: true,
        places: []
    } as IState,
    reducers: {
        setTypes: (state, action: PayloadAction<ThreatType[]>) => {
            state.types = action.payload;
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
    }
});

interface IState {
    types: ThreatType[];
    currentUser?: User;
    loading: boolean;
    places: DistrictInfo[];
}

export const { setTypes, setLoading, setCurrentUser, setPlaces } = mainSlice.actions;
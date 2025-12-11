import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'ar';
    isMobileMenuOpen: boolean;
    isSearchOpen: boolean;
    isCartDrawerOpen: boolean;
}

const initialState: UIState = {
    theme: 'system',
    language: 'en',
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isCartDrawerOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.theme = action.payload;
        },
        setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
            state.language = action.payload;
        },
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen;
        },
        closeMobileMenu: (state) => {
            state.isMobileMenuOpen = false;
        },
        toggleSearch: (state) => {
            state.isSearchOpen = !state.isSearchOpen;
        },
        closeSearch: (state) => {
            state.isSearchOpen = false;
        },
        toggleCartDrawer: (state) => {
            state.isCartDrawerOpen = !state.isCartDrawerOpen;
        },
        closeCartDrawer: (state) => {
            state.isCartDrawerOpen = false;
        },
    },
});

export const {
    setTheme,
    setLanguage,
    toggleMobileMenu,
    closeMobileMenu,
    toggleSearch,
    closeSearch,
    toggleCartDrawer,
    closeCartDrawer,
} = uiSlice.actions;

export default uiSlice.reducer;

import { createContext, ReactNode, useContext } from "react";

type ContextType = {
    likedMovies: string[]
    dislikedMovies: string[]
};

const AppCtx = createContext<ContextType>({'likedMovies': [], 'dislikedMovies': []});

export function useAppContext() {
    return useContext(AppCtx);
}

type Props = {
    children: ReactNode;
}

export function AppProvider({ children }: Props) {
    const sharedState: ContextType = {'likedMovies': [], 'dislikedMovies': []};

    return (
        <AppCtx.Provider value={sharedState}>
            {children}
        </AppCtx.Provider>
    )
}

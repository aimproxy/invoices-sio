import {createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState} from "react";
import {FiscalYear} from "@sio/postgres";

interface KpisContextValue {
    selectedYear: Partial<FiscalYear> | undefined;
    setSelectedYear: Dispatch<SetStateAction<Partial<FiscalYear> | undefined>>;
}

const defaultContextValues: KpisContextValue = {
    selectedYear: undefined,
    setSelectedYear: () => {
    },
}

export const KpisContext = createContext<KpisContextValue>(defaultContextValues);

const KpisProvider = ({children}: PropsWithChildren) => {
    const [selectedYear, setSelectedYear] = useState<Partial<FiscalYear> | undefined>(undefined);

    const inMemory = useMemo(() => ({
        selectedYear,
        setSelectedYear
    }), [selectedYear])

    return (
        <KpisContext.Provider value={inMemory}>
            {children}
        </KpisContext.Provider>
    );
}

export default KpisProvider
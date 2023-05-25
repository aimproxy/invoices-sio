import {createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState} from "react";

interface KpisContextValue {
    selectedCompany?: string;
    setSelectedCompany?: Dispatch<SetStateAction<string | undefined>>;
    selectedYear?: string;
    setSelectedYear?: Dispatch<SetStateAction<string | undefined>>;
}

const defaultContextValues: KpisContextValue = {
    selectedCompany: undefined,
    selectedYear: undefined
}

export const KpisContext = createContext<KpisContextValue>(defaultContextValues);

const KpisProvider = ({children}: PropsWithChildren) => {
    const [selectedCompany, setSelectedCompany] = useState<string | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined)

    const inMemory = useMemo(() => ({
        selectedCompany,
        setSelectedCompany,
        selectedYear,
        setSelectedYear
    }), [selectedCompany, selectedYear])

    return (
        <KpisContext.Provider value={inMemory}>
            {children}
        </KpisContext.Provider>
    );
}

export default KpisProvider
import {createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState} from "react";

interface KpisContextValue {
    selectedCompany: string;
    setSelectedCompany: Dispatch<SetStateAction<string>>;
    selectedYear: string;
    setSelectedYear: Dispatch<SetStateAction<string>>;
}

const defaultContextValues: KpisContextValue = {
    selectedCompany: '',
    setSelectedCompany: () => {
    },
    selectedYear: '',
    setSelectedYear: () => {
    },
}

export const KpisContext = createContext<KpisContextValue>(defaultContextValues);

const KpisProvider = ({children}: PropsWithChildren) => {
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');

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
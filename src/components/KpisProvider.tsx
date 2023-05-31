import {createContext, Dispatch, PropsWithChildren, SetStateAction, useEffect, useMemo, useState} from "react";
import {Company} from "@sio/pages/api/companies";

interface KpisContextValue {
    selectedCompany: Company | undefined
    setSelectedCompany: Dispatch<SetStateAction<Company | undefined>>
    selectedYear: string
    setSelectedYear: Dispatch<SetStateAction<string>>
}

const defaultContextValues: KpisContextValue = {
    selectedCompany: undefined,
    setSelectedCompany: () => {
    },
    selectedYear: '',
    setSelectedYear: () => {
    },
}

export const KpisContext = createContext<KpisContextValue>(defaultContextValues);

const KpisProvider = ({children}: PropsWithChildren) => {
    const [selectedCompany, setSelectedCompany] = useState<Company>()
    const [selectedYear, setSelectedYear] = useState('')

    useEffect(() => {
        localStorage.setItem('selectedCompany', JSON.stringify(selectedCompany));
    }, [selectedCompany]);

    useEffect(() => {
        localStorage.setItem('selectedYear', selectedYear);
    }, [selectedYear]);

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
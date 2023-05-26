import {createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState} from "react";
import {Company, FiscalYear} from "@sio/postgres";

interface KpisContextValue {
    selectedCompany: Partial<Company> | undefined;
    setSelectedCompany: Dispatch<SetStateAction<Partial<Company> | undefined>>;
    selectedYear: Partial<FiscalYear> | undefined;
    setSelectedYear: Dispatch<SetStateAction<Partial<FiscalYear> | undefined>>;
}

const defaultContextValues: KpisContextValue = {
    selectedCompany: undefined,
    setSelectedCompany: () => {
    },
    selectedYear: undefined,
    setSelectedYear: () => {
    },
}

export const KpisContext = createContext<KpisContextValue>(defaultContextValues);

const KpisProvider = ({children}: PropsWithChildren) => {
    const [selectedCompany, setSelectedCompany] = useState<Partial<Company> | undefined>(undefined);
    const [selectedYear, setSelectedYear] = useState<Partial<FiscalYear> | undefined>(undefined);

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
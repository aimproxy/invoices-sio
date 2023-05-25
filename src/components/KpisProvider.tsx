import {createContext, Dispatch, PropsWithChildren, SetStateAction, useMemo, useState} from "react";
import {CompanyResponse} from "@sio/types";

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

const KpisProvider = ({companies, years, children}: PropsWithChildren<CompanyResponse>) => {
    const [selectedCompany, setSelectedCompany] = useState<string>(String(companies[0].companyId));
    const [selectedYear, setSelectedYear] = useState<string>(String(years[companies[0].companyId][0].fiscalYear));

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
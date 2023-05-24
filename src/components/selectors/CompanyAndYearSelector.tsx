import {Dropdown, DropdownItem} from "@tremor/react";
import {useCallback, useMemo, useState} from "react";
import {Company, FiscalYear} from "@sio/types";

const CompanyAndYearSelector = ({companies, years}: {
    companies: Company[],
    years: { [_: string]: FiscalYear[] }
}) => {

    const [selectedCompany, setSelectedCompany] = useState(companies[0].companyId)

    const companyYears = useMemo(() => years[selectedCompany], [selectedCompany, years])
    const [selectedFiscalYear, setSelectedFiscalYear] = useState(companyYears[0].fiscalYear)

    const setSelectedCompanyHandler = useCallback((value: string) => setSelectedCompany(value), []);
    const setSelectedFiscalYearHandler = useCallback((value: string) => setSelectedFiscalYear(value), []);

    return (
        <>
            <Dropdown
                value={selectedCompany}
                onValueChange={setSelectedCompanyHandler}
                placeholder="Select Company"
            >
                {companies.map((company, k) => (
                    <DropdownItem value={company.companyId} text={company.companyName} key={k}/>
                ))}
            </Dropdown>
            <Dropdown
                value={selectedFiscalYear}
                onValueChange={setSelectedFiscalYearHandler}
                placeholder="Select Fiscal Year">
                {companyYears.map((year, k) => (
                    <DropdownItem value={year.fiscalYear} text={year.fiscalYear} key={k}/>
                ))}
            </Dropdown>
        </>
    )
}

export default CompanyAndYearSelector
import {Dropdown, DropdownItem} from "@tremor/react";
import {useContext, useMemo} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {CompanyResponse} from "@sio/types";

const CompanyAndYearSelector = ({companies, years}: CompanyResponse) => {
    const {selectedCompany, setSelectedCompany, selectedYear, setSelectedYear} = useContext(KpisContext)

    const companyYears = useMemo(() => (selectedCompany && years[selectedCompany]) || [], [selectedCompany, years])

    return (
        <>
            <Dropdown
                value={selectedCompany}
                onValueChange={setSelectedCompany}
                placeholder="Select Company"
            >
                {companies.map((company, k) => (
                    <DropdownItem value={String(company.companyId)} text={company.companyName} key={k}/>
                ))}
            </Dropdown>
            <Dropdown
                disabled={selectedCompany == undefined}
                value={selectedYear}
                onValueChange={setSelectedYear}
                placeholder="Select Fiscal Year">
                {companyYears.map((year, k) => (
                    <DropdownItem value={String(year.fiscalYear)} text={String(year.fiscalYear)} key={k}/>
                ))}
            </Dropdown>
        </>
    )
}

export default CompanyAndYearSelector
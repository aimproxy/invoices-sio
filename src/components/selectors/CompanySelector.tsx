import {DropdownItem} from "@tremor/react";
import {useCallback, useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import CustomDropdown from "@sio/components/primitives/CustomDropdown";
import {CompanyReturnType} from "@sio/query";

interface CompanySelectorProps {
    companies?: CompanyReturnType
    loading: boolean
    disabled: boolean
}

const CompanySelector = ({companies, loading, disabled}: CompanySelectorProps) => {
    const {selectedCompany, setSelectedCompany} = useContext(KpisContext)

    const setSelectedCompanyCallback = useCallback((companyId: string) => {
        const company = companies?.filter(company => company.company_id == Number(companyId))[0];

        setSelectedCompany(company)
    }, [companies, setSelectedCompany])

    const dropdownItems = companies?.map((company, k) => (
        <DropdownItem value={String(company.company_id)} text={company.company_name} key={k}/>
    ))

    return (
        <CustomDropdown
            loading={loading}
            disabled={disabled}
            value={selectedCompany?.company_name}
            onValueChange={setSelectedCompanyCallback}
            placeholder="Select Company"
        >
            {dropdownItems ?? []}
        </CustomDropdown>
    )
}

export default CompanySelector
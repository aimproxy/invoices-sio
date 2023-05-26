import {DropdownItem} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import CustomDropdown from "@sio/components/primitives/CustomDropdown";
import {CompanyReturnType} from "@sio/query";

interface CompanySelectorProps {
    companies: CompanyReturnType
    loading: boolean
    disabled: boolean
}

const CompanySelector = ({companies, loading, disabled}: CompanySelectorProps) => {
    const {selectedCompany, setSelectedCompany} = useContext(KpisContext)

    return (
        <CustomDropdown
            loading={loading}
            disabled={disabled}
            value={selectedCompany}
            onValueChange={setSelectedCompany}
            placeholder="Select Company"
        >
            {companies.map((company, k) => (
                <DropdownItem value={String(company.company_id)} text={company.company_name} key={k}/>
            ))}
        </CustomDropdown>
    )
}

export default CompanySelector
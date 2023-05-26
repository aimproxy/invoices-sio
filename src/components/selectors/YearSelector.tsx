import {useContext, useMemo} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import CustomDropdown from "@sio/components/primitives/CustomDropdown";
import {DropdownItem} from "@tremor/react";
import {YearsReturnType} from "@sio/query";

interface YearSelectorProps {
    years: { [key: string]: YearsReturnType }
    loading: boolean
    disabled: boolean
}

const YearSelector = ({years, loading, disabled}: YearSelectorProps) => {
    const {selectedCompany, selectedYear, setSelectedYear} = useContext(KpisContext)

    const memoizedYears = useMemo(
        () => (selectedCompany && years[selectedCompany]) || [],
        [selectedCompany, years]
    )

    return (
        <CustomDropdown
            loading={loading}
            disabled={disabled}
            value={selectedYear}
            onValueChange={setSelectedYear}
            placeholder="Select Year">
            {memoizedYears.map((year, k) => (
                <DropdownItem value={String(year.fiscal_year)} text={String(year.fiscal_year)} key={k}/>
            ))}
        </CustomDropdown>
    )
}

export default YearSelector
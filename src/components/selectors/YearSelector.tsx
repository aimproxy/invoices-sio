import {useCallback, useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {Button, Dropdown, DropdownItem} from "@tremor/react";
import {YearsReturnType} from "@sio/query";

interface YearSelectorProps {
    years?: YearsReturnType
    loading: boolean
    disabled: boolean
}

const YearSelector = ({years, loading, disabled}: YearSelectorProps) => {
    const {selectedCompany, selectedYear, setSelectedYear} = useContext(KpisContext)

    const setSelectedYearCallback = useCallback((year: string) => {
        const filtered = years?.filter(y => y.fiscal_year == Number(year))[0]

        setSelectedYear(filtered)
    }, [years, setSelectedYear])

    const showMockButton = loading || disabled

    const dropdownItems = years?.map((year, k) => (
        <DropdownItem value={String(year.fiscal_year)} text={String(year.fiscal_year)} key={k}/>
    ))

    return showMockButton ? (
        <Button size={"sm"} loading={loading} disabled={disabled} variant={'secondary'}/>
    ) : (
        <Dropdown
            value={String(selectedYear?.fiscal_year)}
            onValueChange={setSelectedYearCallback}
            placeholder="Select Year">
            {dropdownItems ?? []}
        </Dropdown>
    )
}

export default YearSelector
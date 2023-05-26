import {useCallback, useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {Button, Dropdown, DropdownItem} from "@tremor/react";
import {YearsReturnType} from "@sio/query";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CalculatorIcon} from "@heroicons/react/24/outline";

interface DoMathProps {
    company: string
    year: string
}

const doMath = async ({company, year}: DoMathProps) => {
    return await fetch(`/api/saft/kpis?company_id=${company}&year=${year}`)
}

interface YearSelectorProps {
    years?: YearsReturnType
    loading: boolean
    disabled: boolean
}

const YearSelector = ({years, loading, disabled}: YearSelectorProps) => {
    const queryClient = useQueryClient();

    const {selectedYear, setSelectedYear} = useContext(KpisContext)

    const setSelectedYearCallback = useCallback((year: string) => {
        const filtered = years?.filter(y => y.fiscal_year == Number(year))[0]

        setSelectedYear(filtered)
    }, [years, setSelectedYear])

    const showMockButton = loading || disabled

    const dropdownItems = years?.map((year, k) => (
        <DropdownItem value={String(year.fiscal_year)} text={String(year.fiscal_year)} key={k}/>
    ))

    const {mutate, isLoading} = useMutation(doMath, {
        onSuccess: data => {
            console.log(data);
        },
        onError: () => {
            console.error("there was an error")
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['kpis']}).then(console.log)
            queryClient.invalidateQueries({queryKey: ['years', company]}).then(console.log)
        }
    });

    return (
        <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
            {showMockButton ? (
                <Button size={"sm"} loading={loading} disabled={disabled} variant={'secondary'}/>
            ) : (
                <Dropdown
                    value={String(selectedYear?.fiscal_year)}
                    onValueChange={setSelectedYearCallback}
                    placeholder="Select Year">
                    {dropdownItems ?? []}
                </Dropdown>
            )}
            <Button size="sm"
                    color="emerald"
                    loading={isLoading}
                    icon={CalculatorIcon}
                    disabled={selectedYear == undefined}
                    onClick={() => mutate({
                        company: String(company),
                        year: String(selectedYear?.fiscal_year)
                    })}>
                Run Calculations
            </Button>
        </div>
    )
}

export default YearSelector
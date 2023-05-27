import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {Button, Dropdown, DropdownItem} from "@tremor/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {VariableIcon} from "@heroicons/react/24/solid";

interface DoMathProps {
    company: string
    year: string
}

const doMath = async ({company, year}: DoMathProps) => {
    return await fetch(`/api/saft/kpis?company_id=${company}&year=${year}`)
}

const YearSelector = () => {
    const queryClient = useQueryClient();

    const {selectedCompany, selectedYear, setSelectedYear} = useContext(KpisContext)

    const dropdownItems = selectedCompany?.fiscal_years.map((year, k) => (
        <DropdownItem value={String(year)} text={String(year)} key={k}/>
    ))

    const {mutate} = useMutation(doMath, {
        onSuccess: data => {
            console.log(data);
        },
        onError: () => {
            console.error("there was an error")
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['years', selectedCompany]}).then(console.log)
        }
    });

    return (
        <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
            <Dropdown
                value={String(selectedYear)}
                onValueChange={setSelectedYear}
                placeholder="Select Year">
                {dropdownItems ?? []}
            </Dropdown>
            <Button size="sm"
                    color="teal"
                    icon={VariableIcon}
                    disabled={selectedYear == undefined}
                    onClick={() => mutate({
                        company: String(selectedCompany?.company_id),
                        year: String(selectedYear)
                    })}>
                Run Calculations
            </Button>
        </div>
    )
}

export default YearSelector
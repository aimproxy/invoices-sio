import {Button} from "@tremor/react";
import {CalculatorIcon} from "@heroicons/react/24/outline";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {useMutation, useQueryClient} from "@tanstack/react-query";

interface RunCalculationsFetchProps {
    company: string
    year: string
}

const runCalculations = async ({company, year}: RunCalculationsFetchProps) => {
    return await fetch(`/api/kpis?company_id=${company}&year=${year}`)
}

const RunCalculationsButton = () => {
    const queryClient = useQueryClient();
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {mutate, isLoading} = useMutation(runCalculations, {
        onSuccess: data => {
            console.log(data);
        },
        onError: () => {
            console.error("there was an error")
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['kpis']}).then(console.log)
        }
    });

    return (
        <Button size="sm"
                loading={isLoading}
                icon={CalculatorIcon}
                color={"emerald"}
                disabled={selectedCompany == undefined || selectedYear == undefined}
                onClick={() => mutate({
                    company: String(selectedCompany.company_id),
                    year: String(selectedYear.fiscal_year)
                })}>
            Run Calculations
        </Button>
    )
}

export default RunCalculationsButton
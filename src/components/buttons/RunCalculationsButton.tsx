import {useContext} from "react";
import {Button} from "@tremor/react";
import {CalculatorIcon} from "@heroicons/react/24/outline";
import {KpisContext} from "@sio/components/KpisProvider";
import {useMutation, useQueryClient} from "@tanstack/react-query";

interface RunCalculationsFetchProps {
    company: string
    year: string
}

const runCalculations = async ({company, year}: RunCalculationsFetchProps) => {
    return await fetch(`/api/kpis?company_id=${company}&year=${year}`)
}

interface RunCalculationsButtonProps {
    company: number
}

const RunCalculationsButton = ({company}: RunCalculationsButtonProps) => {
    const queryClient = useQueryClient();
    const {selectedYear} = useContext(KpisContext)

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
                disabled={selectedYear == undefined}
                onClick={() => mutate({
                    company: String(company),
                    year: String(selectedYear?.fiscal_year)
                })}>
            Run Calculations
        </Button>
    )
}

export default RunCalculationsButton
import {Button} from "@tremor/react";
import {CalculatorIcon} from "@heroicons/react/24/outline";
import {useCallback, useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";

const RunCalculationsButton = () => {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const runCalculationsCallback = useCallback(async () => {
        await fetch(`/api/kpis?company_id=${selectedCompany}&year=${selectedYear}`)
            .then(s => console.log(s))
            .catch(e => console.error(e))
    }, [selectedCompany, selectedYear])

    return (
        <Button size="sm"
                icon={CalculatorIcon}
                color={"emerald"}
                disabled={selectedCompany == undefined || selectedYear == undefined}
                onClick={runCalculationsCallback}>
            Run Calculations
        </Button>
    )
}

export default RunCalculationsButton
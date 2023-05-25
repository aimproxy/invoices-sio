import {Button} from "@tremor/react";
import {CalculatorIcon} from "@heroicons/react/24/outline";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";

const RunCalculationsButton = () => {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    return (
        <Button size="sm"
                icon={CalculatorIcon}
                disabled={selectedCompany == undefined || selectedYear == undefined}
                onClick={() => console.log("clicked")}>
            Refresh data
        </Button>
    )
}

export default RunCalculationsButton
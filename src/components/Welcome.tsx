import {Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";

const Welcome = () => {
    const {selectedCompany} = useContext(KpisContext)

    return (
        <div className="block sm:flex sm:justify-between">
            <div className="flex flex-col">
                <Title>Olá, {selectedCompany?.company_name}!</Title>
                <Text>Aqui o especialista és sempre tu!</Text>
            </div>
        </div>
    )
}

export default Welcome
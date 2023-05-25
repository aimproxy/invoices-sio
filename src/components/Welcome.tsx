import {Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";

const Welcome = () => {
    const {selectedCompany} = useContext(KpisContext)

    return (
        <div className="flex flex-col">
            <Title>Olá, {selectedCompany ?? 'Demo'}!</Title>
            <Text>Aqui o especialista és sempre tu!</Text>
        </div>
    )
}

export default Welcome
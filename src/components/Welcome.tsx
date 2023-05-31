import {Text, Title} from "@tremor/react";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Link from "next/link";

const Welcome = () => {
    const {selectedCompany} = useContext(KpisContext)

    return (
        <div className="flex space-x-4">
            <Link href="/"
                  className="bg-white hover:bg-gray-50 border border-gray-300 rounded shadow p-2 h-fit w-fit">
                <ArrowLeftIcon className="text-gray-900 font-semibold w-5 h-5"/>
            </Link>
            <div className="flex flex-col">
                <Title>Olá, {selectedCompany?.company_name}!</Title>
                <Text>Aqui o especialista és sempre tu!</Text>
            </div>
        </div>
    )
}

export default Welcome
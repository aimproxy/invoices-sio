import {Text, Title} from "@tremor/react";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import BaseProps from "@sio/types";

const Welcome = ({company, year}: BaseProps) => {
    return (
        <div className="flex space-x-4">
            <Link href="/"
                  className="bg-white hover:bg-gray-50 border border-gray-300 rounded shadow p-2 h-fit w-fit">
                <ArrowLeftIcon className="text-gray-900 font-semibold w-5 h-5"/>
            </Link>
            <div className="flex flex-col">
                <Title>{company}, Serie {year}</Title>
                <Text>Aqui o especialista és sempre tu!</Text>
            </div>
        </div>
    )
}

export default Welcome
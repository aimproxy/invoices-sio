import {Text, Title} from "@tremor/react";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import Link from "next/link";
import BaseProps from "@sio/types";
import useCompany from "@sio/hooks/useCompany";
import TextSkeleton from "@sio/components/skeletons/TextSkeleton";

const Welcome = ({company, year}: BaseProps) => {
    const {data, isLoading, isError} = useCompany({company})

    return (
        <div className="flex space-x-4">
            <Link href="/"
                  className="bg-white hover:bg-gray-50 border border-gray-300 rounded shadow p-2 h-fit w-fit">
                <ArrowLeftIcon className="text-gray-900 font-semibold w-5 h-5"/>
            </Link>
            <div className="flex flex-col">
                {(isLoading || isError) ?
                    <TextSkeleton/>
                    :
                    <>
                        <Title>{data?.[0].company_name}</Title>
                        <Text>Fiscal year of {year}</Text>
                    </>
                }

            </div>
        </div>
    )
}

export default Welcome
import BaseProps from "@sio/types";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Button, Dropdown, DropdownItem} from "@tremor/react";
import {VariableIcon} from "@heroicons/react/24/solid";
import {useCallback, useState} from "react";
import {useRouter} from "next/router";
import useCompany from "@sio/hooks/useCompany";

interface DoMathProps {
    company: string
    year: string
}

const doMath = async ({company, year}: DoMathProps) => {
    return await fetch(`/api/saft/kpis?company=${company}&year=${year}`)
}

const YearSelector = ({company, year}: BaseProps) => {
    const router = useRouter()
    const queryClient = useQueryClient();

    const {data, isLoading, isError} = useCompany({company})
    const [loading, setIsLoading] = useState(false)

    const {mutate} = useMutation(doMath, {
        onError: console.error,
        onSuccess: () => setIsLoading(false),
        onMutate: () => setIsLoading(true),
        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ['year', company, year]}),
                queryClient.invalidateQueries({queryKey: ['products', company, year]}),
                queryClient.invalidateQueries({queryKey: ['customers', company, year]}),
                queryClient.invalidateQueries({queryKey: ['revenue_over_time', company, year]}),
                queryClient.invalidateQueries({queryKey: ['sales_by_city', company, year]}),
                queryClient.invalidateQueries({queryKey: ['sales_by_country', company, year]}),
            ])
        }
    });

    const pushYearToRoute = useCallback(async (value: string) => {
        await router.push({
            pathname: router.pathname.replace('[companies]', company).replace('[year]', value),
        })
    }, [company, router])

    return (
        <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
            <Dropdown
                value={year}
                onValueChange={pushYearToRoute}
                placeholder="Select Year">
                {data?.map(({fiscal_year}: { fiscal_year: string }) => (
                    <DropdownItem value={fiscal_year} text={fiscal_year} key={fiscal_year}/>
                )) || []}
            </Dropdown>
            <Button size="sm"
                    color="teal"
                    icon={VariableIcon}
                    disabled={isError}
                    loading={loading || isLoading || isError}
                    onClick={() => mutate({company, year})}>
                Run Calculations
            </Button>
        </div>
    )
}

export default YearSelector
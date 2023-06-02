import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useRevenueByCity = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByCity = async (company: string, year: string) => {
        const res = await fetch(`/api/revenue_by_city?company=${company}&year=${year}`)
        return await res.json();
    }

    const {data, isLoading, isError} = useQuery(
        ['revenue_by_city', company, year], {
            queryFn: async () => await fetchSalesByCity(company, year),
        })

    return useMemo(() => {
        const revenueByCity = data?.map((rc: any) => ({
            billing_city: rc.billing_city,
            net_total: Number(rc.net_total)
        }))

        return {
            revenueByCity,
            isLoading,
            isError
        }
    }, [data, isError, isLoading])
}

export default useRevenueByCity
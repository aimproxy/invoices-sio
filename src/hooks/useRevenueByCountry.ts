import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useRevenueByCountry = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByCountry = async (company: string, year: string) => {
        const res = await fetch(`/api/revenue_by_country?company=${company}&year=${year}`)
        return await res.json();
    }

    const {data, isLoading, isError} = useQuery(
        ['revenue_by_country', company, year], {
            queryFn: async () => await fetchSalesByCountry(company, year),
        })

    return useMemo(() => {
        const revenueByCountry = data?.map((rc: any) => ({
            billing_country: rc.billing_country,
            net_total: Number(rc.net_total)
        }))

        return {
            revenueByCountry,
            isLoading,
            isError
        }
    }, [data, isError, isLoading])
}

export default useRevenueByCountry
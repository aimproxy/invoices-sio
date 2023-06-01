import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {RevenueByCountry} from "@sio/pages/api/revenue_by_country";

const useRevenueByCountry = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByCountry = async (company: string, year: string): Promise<RevenueByCountry[]> => {
        const res = await fetch(`/api/revenue_by_country?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['revenue_by_country', company, year], {
        queryFn: async () => await fetchSalesByCountry(company, year),
    })

    const revenueByCountry = data?.map((rc) => ({
        billing_country: rc.billing_country,
        net_total: Number(rc.net_total)
    }))

    return useMemo(() => ({
        revenueByCountry,
        isLoading,
        isError
    }), [revenueByCountry, isError, isLoading])
}

export default useRevenueByCountry
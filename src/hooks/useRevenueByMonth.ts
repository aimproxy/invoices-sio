import {RevenueByMonth} from "@sio/pages/api/revenue_by_month";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useRevenueByMonth = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByMonth = async (company: string, year: string): Promise<RevenueByMonth[]> => {
        const res = await fetch(`/api/revenue_by_month?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['revenue_by_month', company, year], {
        queryFn: async () => await fetchSalesByMonth(company, year),
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useRevenueByMonth
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {RevenueOverTime} from "@sio/pages/api/revenue_over_time";

const useRevenueOverTime = ({company, year}: { company: string, year: string }) => {

    const fetchRevenueOverTime = async (company: string, year: string): Promise<RevenueOverTime[]> => {
        const res = await fetch(`/api/revenue_over_time?company=${company}&year=${year}`)
        return await res.json();
    }

    function getMonthWord(monthNumber: number): string {
        const date = new Date();
        date.setMonth(monthNumber - 1); // Subtract 1 because months are zero-based in JavaScript

        return date.toLocaleString('default', {month: 'long'});
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['revenue_over_time', company, year], {
        queryFn: async () => await fetchRevenueOverTime(company, year),
    })

    const revenueOverTime = data?.map(revenue => ({
        month: getMonthWord(revenue.month),
        "Net Sales": Number(revenue.net_total),
        "Gross Sales": Number(revenue.gross_total)
    }))

    return useMemo(() => ({
        revenueOverTime,
        isLoading,
        isError
    }), [revenueOverTime, isLoading, isError])
}

export default useRevenueOverTime
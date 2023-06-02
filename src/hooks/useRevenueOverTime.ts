import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useRevenueOverTime = ({company, year}: { company: string, year: string }) => {
    const fetchRevenueOverTime = async (company: string, year: string) => {
        const res = await fetch(`/api/revenue_over_time?company=${company}&year=${year}`)
        return await res.json();
    }

    const getMonthWord = (monthNumber: number): string => {
        const date = new Date();
        date.setMonth(monthNumber - 1); // Subtract 1 because months are zero-based in JavaScript

        const month = date.toLocaleString('default', {month: 'long'});
        return month.charAt(0).toUpperCase() + month.slice(1);
    }

    const {data, isLoading, isError} = useQuery(['revenue_over_time', company, year], {
        queryFn: async () => await fetchRevenueOverTime(company, year),
    })

    return useMemo(() => {
        let cumulativeNetTotal = 0
        const revenueOverTime = data?.map((revenue: any) => {
            cumulativeNetTotal += Number(revenue.net_total);

            return {
                month: getMonthWord(revenue.month),
                "Net Sales": Number(revenue.net_total),
                "Gross Sales": Number(revenue.gross_total),
                "Cumulative Revenue": cumulativeNetTotal,
            }
        })

        return {
            revenueOverTime,
            isLoading,
            isError
        }
    }, [data, isLoading, isError])
}

export default useRevenueOverTime
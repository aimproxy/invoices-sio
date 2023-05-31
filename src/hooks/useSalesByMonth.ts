import {SalesByMonth} from "@sio/pages/api/sales_by_month";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useSalesByMonth = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByMonth = async (company: string, year: string): Promise<SalesByMonth[]> => {
        const res = await fetch(`/api/sales_by_month?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['sales_by_month', company, year], {
        queryFn: async () => await fetchSalesByMonth(company, year),
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useSalesByMonth
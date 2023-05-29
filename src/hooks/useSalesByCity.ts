import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {SalesByCity} from "@sio/pages/api/sales_by_city";

const useSalesByCity = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByCity = async (company: string, year: string): Promise<SalesByCity[]> => {
        const res = await fetch(`/api/sales_by_city?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['sales_by_city', company, year], {
        queryFn: async () => await fetchSalesByCity(company, year),
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useSalesByCity
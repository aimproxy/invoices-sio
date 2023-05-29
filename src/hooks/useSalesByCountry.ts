import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {SalesByCountry} from "@sio/pages/api/sales_by_country";

const useSalesByCountry = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByCountry = async (company: string, year: string): Promise<SalesByCountry[]> => {
        const res = await fetch(`/api/sales_by_country?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['sales_by_country', company, year], {
        queryFn: async () => await fetchSalesByCountry(company, year),
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useSalesByCountry
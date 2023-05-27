import {Year} from "@sio/pages/api/year";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useTopProducts = ({company, year}: { company: string, year: string }) => {
    const fetchTopProducts = async (company: string, year: string): Promise<Year> => {
        const res = await fetch(`/api/top_products?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['top_products', company, year], {
        queryFn: async () => await fetchTopProducts(company, year),
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useTopProducts
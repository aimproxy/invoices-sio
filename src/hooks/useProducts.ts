import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const useProducts = ({company, year}: { company: string, year: string }) => {
    const fetchProducts = async (company: string, year: string) => {
        const res = await fetch(`/api/products?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['products', company, year], {
        queryFn: async () => await fetchProducts(company, year),
    })

    return useMemo(() => ({
        products: data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useProducts
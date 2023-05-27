import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {TopProduct} from "@sio/pages/api/top_products";

const useTopProducts = ({company, year}: { company: string, year: string }) => {
    const fetchTopProducts = async (company: string, year: string): Promise<TopProduct[]> => {
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

    const products = data?.map(product => ({
        name: product.product_description.slice(0, 30),
        value: Number(product.amount_spent)
    }))

    return useMemo(() => ({
        products,
        isLoading,
        isError
    }), [products, isError, isLoading])
}

export default useTopProducts
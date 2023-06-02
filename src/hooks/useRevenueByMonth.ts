import {useQuery} from "@tanstack/react-query";

const useRevenueByMonth = ({company, year}: { company: string, year: string }) => {
    const fetchSalesByMonth = async (company: string, year: string) => {
        const res = await fetch(`/api/revenue_by_month?company=${company}&year=${year}`)
        return await res.json();
    }

    return useQuery(['revenue_by_month', company, year], {
        queryFn: async () => await fetchSalesByMonth(company, year),
    })
}

export default useRevenueByMonth
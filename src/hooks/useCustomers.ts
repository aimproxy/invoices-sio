import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {Customer} from "@sio/pages/api/customers";

const useCustomers = ({company, year}: { company: string, year: string }) => {
    const fetchCustomers = async (company: string): Promise<Customer[]> => {
        const res = await fetch(`/api/customers?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
            queryKey: ['customers', company, year],
            queryFn: async () => await fetchCustomers(company)
        }
    )

    return useMemo(() => ({
        data,
        isLoading,
        isError,
    }), [data, isError, isLoading])
}

export default useCustomers
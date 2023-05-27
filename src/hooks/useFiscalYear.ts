import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {FiscalYearReturnType} from "@sio/pages/api/year";

const useFiscalYear = ({company, year}: { company: string, year: string }) => {
    const fetchFiscalYear = async (company: string, year: string): Promise<FiscalYearReturnType> => {
        const res = await fetch(`/api/year?company=${company}&year=${year}`)
        return await res.json();
    }

    const {
        data,
        isLoading,
        isError
    } = useQuery(['year', company, year], {
        queryFn: async () => await fetchFiscalYear(company, year),
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useFiscalYear
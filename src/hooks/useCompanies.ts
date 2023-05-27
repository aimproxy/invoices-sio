import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {CompaniesReturnType} from "@sio/pages/api/companies";

const useCompanies = () => {
    const fetchCompanies = async (): Promise<CompaniesReturnType> => {
        const res = await fetch('/api/companies')
        return await res.json();
    }

    const {data, isLoading, isError} = useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    })

    return useMemo(() => ({
        data,
        isLoading,
        isError
    }), [data, isError, isLoading])
}

export default useCompanies
import {useQuery} from "@tanstack/react-query";
import {Company} from "@sio/pages/api/companies";

const useCompanies = () => {
    const fetchCompanies = async (): Promise<Company[]> => {
        const res = await fetch('/api/companies')
        return await res.json();
    }

    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    })
}

export default useCompanies
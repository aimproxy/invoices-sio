import {useQuery} from "@tanstack/react-query";

const useCompanies = () => {
    const fetchCompanies = async () => {
        const res = await fetch('/api/companies')
        return await res.json();
    }

    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    })
}

export default useCompanies
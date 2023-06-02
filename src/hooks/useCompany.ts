import {useQuery} from "@tanstack/react-query";

const useCompany = ({company}: { company: string }) => {
    const fetchCompany = async () => {
        const res = await fetch(`/api/companies/${company}`)
        return await res.json();
    }

    return useQuery({
        queryKey: ['company', company],
        queryFn: fetchCompany,
    })
}

export default useCompany
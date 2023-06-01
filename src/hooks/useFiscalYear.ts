import {useQuery} from "@tanstack/react-query";
import {Year} from "@sio/pages/api/year";

const useFiscalYear = ({company, year}: { company: string, year: string }) => {
    const fetchFiscalYear = async (company: string, year: string): Promise<Year> => {
        const res = await fetch(`/api/year?company=${company}&year=${year}`)
        return await res.json();
    }

    return useQuery(['year', company, year], {
        queryFn: async () => await fetchFiscalYear(company, year),
    })
}

export default useFiscalYear
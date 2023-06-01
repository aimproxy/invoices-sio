import {useRouter} from "next/router";

const useCompanyRouter = () => {
    const router = useRouter()
    const company = router.query.company as string
    const year = router.query.year as string

    return {company, year}
}

export default useCompanyRouter
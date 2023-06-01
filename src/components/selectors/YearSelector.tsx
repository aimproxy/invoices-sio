interface DoMathProps {
    company: string
    year: string
}

const doMath = async ({company, year}: DoMathProps) => {
    return await fetch(`/api/saft/kpis?company=${company}&year=${year}`)
}

/*
const YearSelector = () => {
    const queryClient = useQueryClient();


    const dropdownItems = selectedCompany?.fiscal_years.map((year, k) => (
        <DropdownItem value={String(year)} text={String(year)} key={k}/>
    ))

    const {mutate} = useMutation(doMath, {
        onSuccess: data => {
            console.log(data);
        },
        onError: () => {
            console.error("there was an error")
        },
        onSettled: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ['year', selectedCompany, selectedYear]}),
                queryClient.invalidateQueries({queryKey: ['products', selectedCompany, selectedYear]}),
                queryClient.invalidateQueries({queryKey: ['customers', selectedCompany, selectedYear]}),
                queryClient.invalidateQueries({queryKey: ['revenue_over_time', selectedCompany, selectedYear]}),
                queryClient.invalidateQueries({queryKey: ['sales_by_city', selectedCompany, selectedYear]}),
                queryClient.invalidateQueries({queryKey: ['sales_by_country', selectedCompany, selectedYear]}),
            ]).then(console.log).catch(console.error)
        }
    });

    return (
        <div className="flex flex-row space-x-4 items-center mt-4 sm:mt-0">
            <Dropdown
                value={String(selectedYear)}
                onValueChange={setSelectedYear}
                placeholder="Select Year">
                {dropdownItems ?? []}
            </Dropdown>
            <Button size="sm"
                    color="teal"
                    icon={VariableIcon}
                    disabled={selectedYear == undefined}
                    onClick={() => mutate({
                        company: String(selectedCompany?.company_id),
                        year: String(selectedYear)
                    })}>
                Run Calculations
            </Button>
        </div>
    )
}

export default YearSelector
 */
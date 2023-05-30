import {BarList, Card, Flex, Text, Title} from "@tremor/react";
import useCustomers from "@sio/hooks/useCustomers";
import {useContext} from "react";
import {KpisContext} from "@sio/components/KpisProvider";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";


const valueFormatter = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()} €`;
export default function TopCustomersByRevenue() {
    const {selectedCompany, selectedYear} = useContext(KpisContext)

    const {data, isLoading, isError} = useCustomers({
        company: String(selectedCompany?.company_id),
        year: selectedYear
    })

    return (
        <Card>
            <Title>Top Customers By Revenue</Title>
            {(isLoading || isError || data?.length === 0) ? (
                <ChartSkeleton/>
            ) : (
                <>
                    <Flex className="mt-4">
                        <Text>Name</Text>
                        <Text className="text-right">Revenue</Text>
                    </Flex>
                    <BarList
                        color={"emerald"}
                        data={data!.slice(0, 5).map(customer => ({
                            name: customer.company_name,
                            value: customer.customer_net_total
                        }))}
                        valueFormatter={valueFormatter}
                        className="mt-2"
                    />
                </>
            )}
        </Card>
    )
}
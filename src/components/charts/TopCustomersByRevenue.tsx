import {BarList, Card, Flex, Text, Title} from "@tremor/react";
import useCustomers from "@sio/hooks/useCustomers";
import ChartSkeleton from "@sio/components/skeletons/ChartSkeleton";
import formatEuro from "@sio/utils/formatEuro";
import BaseProps from "@sio/types";

export default function TopCustomersByRevenue({company, year}: BaseProps) {
    const {data, isLoading, isError} = useCustomers({company, year})

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
                        color="emerald"
                        data={data!.slice(0, 5).map((customer: any) => ({
                            name: customer.company_name,
                            value: customer.customer_net_total
                        }))}
                        valueFormatter={formatEuro}
                        className="mt-2"
                    />
                </>
            )}
        </Card>
    )
}
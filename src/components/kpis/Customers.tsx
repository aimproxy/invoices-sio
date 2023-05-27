import {BadgeDelta, Card, Flex, Metric, ProgressBar, Text, Title} from "@tremor/react";

const Customers = () => (
    <Card>
        <Flex justifyContent="between" alignItems="center">
            <Title>Customers</Title>
            <BadgeDelta
                deltaType="increase"
                isIncreasePositive={true}
                size="xs"
            >
                <span className="font-semibold">+12.3%</span>
            </BadgeDelta>
        </Flex>
        <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-1 mt-4"
        >
            <Metric>61%</Metric>
            <Text>/ 252 customers</Text>
        </Flex>
        <ProgressBar percentageValue={61} color="teal" className="mt-3"/>
    </Card>
);
export default Customers
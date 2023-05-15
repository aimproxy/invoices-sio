import { Card, Title, Text, Tab, TabList, Grid } from "@tremor/react";

import { useState } from "react";

export default function Example() {
    const [selectedView, setSelectedView] = useState("1");
    return (
        <main className={"max-w-7xl mx-auto pt-16 sm:pt-8 px-8"}>
            <Title>Olá, Sales Manager X!</Title>
            <Text>Aqui o especialista és sempre tu!</Text>

            <TabList
                defaultValue="1"
                onValueChange={(value) => setSelectedView(value)}
                className="mt-6"
            >
                <Tab value="1" text="Dashboard" />
                <Tab value="2" text="Importar SAF-T" />
            </TabList>

            {selectedView === "1" ? (
                <>
                    <Grid numColsMd={2} numColsLg={3} className="gap-6 mt-6">
                        <Card>
                            {/* Placeholder to set height */}
                            <div className="h-28" />
                        </Card>
                        <Card>
                            {/* Placeholder to set height */}
                            <div className="h-28" />
                        </Card>
                        <Card>
                            {/* Placeholder to set height */}
                            <div className="h-28" />
                        </Card>
                    </Grid>

                    <div className="mt-6">
                        <Card>
                            <div className="h-80" />
                        </Card>
                    </div>
                </>
            ) : (
                <div className="mt-6">
                    <Card>
                        <div className="h-96" />
                    </Card>
                </div>
            )}
        </main>
    );
}

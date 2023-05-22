import {Card, Col, Grid, Metric, Tab, TabList, Text, Title} from "@tremor/react";
import {DocumentIcon} from '@heroicons/react/24/outline'

import {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";

const classNames = (...s: string[]) => s.filter(Boolean).join(' ');

const SAFTDropzone = () => {

    const onDrop = useCallback((acceptedFiles: any[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = async () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                console.log(binaryStr)

                // Make the file upload request
                const response = await fetch('/api/dom', {
                    method: 'POST',
                    body: binaryStr,
                });

                // Handle the response from the backend
                const data = await response.json();
                console.log('Upload successful:', data);
            }
            reader.readAsArrayBuffer(file)
        })
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'text/xml': ['.xml']}
    })

    return (
        <div className="mt-6" {...getRootProps()}>
            <div className={classNames(
                "mt-2 flex justify-center rounded-lg border border-solid px-6 py-10",
                isDragActive ? 'border-emerald-400' : 'border-gray-200'
            )}>
                <div className="flex flex-col items-center">
                    <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <div className={classNames(
                            'relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600',
                            'focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600',
                            'focus-within:ring-offset-2 hover:text-indigo-500'
                        )}
                        >
                            <span>Upload a file</span>
                            <input {...getInputProps()} className="sr-only"/>
                        </div>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">XML up to 10MB</p>
                </div>
            </div>
        </div>
    )
}

export default function Home() {
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
                <Tab value="1" text="Dashboard"/>
                <Tab value="2" text="Importar SAF-T"/>
            </TabList>

            {selectedView === "1" ? (
                <div className="mt-6">
                    <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-2">
                        <Col numColSpan={1} numColSpanLg={2}>
                            <Card>
                                <Text>Title</Text>
                                <Metric>KPI 1</Metric>
                            </Card>
                        </Col>
                        <Card>
                            <Text>Title</Text>
                            <Metric>KPI 2</Metric>
                        </Card>
                        <Col>
                            <Card>
                                <Text>Title</Text>
                                <Metric>KPI 3</Metric>
                            </Card>
                        </Col>
                        <Card>
                            <Text>Title</Text>
                            <Metric>KPI 4</Metric>
                        </Card>
                        <Card>
                            <Text>Title</Text>
                            <Metric>KPI 5</Metric>
                        </Card>
                    </Grid>
                </div>
            ) : (
                <SAFTDropzone/>
            )}
        </main>
    );
}

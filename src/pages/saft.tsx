import {DocumentIcon} from "@heroicons/react/24/outline";
import {ElementType, useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Callout, Color, Text, Title} from "@tremor/react";
import Tabs from "@sio/components/Tabs";
import {SpinSkeleton} from "@sio/components/skeletons/SpinSkeleton";
import {SaftResponse} from "@sio/pages/api/saft/dom";
import {CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import {useQueryClient} from "@tanstack/react-query";

const classNames = (...s: (string | null)[]) => s.filter(Boolean).join(' ');

const SAFT = () => {
    const queryClient = useQueryClient();

    const [showCallout, setShowCallout] = useState<{
        title: string,
        description: string,
        icon: ElementType,
        color: Color
    } | undefined>(undefined)

    const [showSpin, setShowSpin] = useState(false)

    const onDrop = useCallback((acceptedFiles: any[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onerror = () => setShowCallout({
                title: 'Erro durante a importação',
                description: 'Foi encontrado um error durante a leitura do SAF-T!',
                icon: ExclamationTriangleIcon,
                color: "rose"
            })

            reader.onloadstart = () => {
                setShowCallout(undefined)
                setShowSpin(true)
            }

            reader.onload = async () => {
                const response = await fetch('/api/saft/dom', {
                    method: 'POST',
                    body: reader.result,
                });

                const {ok, e} = await response.json() as SaftResponse;
                if (!ok) {
                    setShowCallout({
                        title: 'Erro durante a importação',
                        description: e,
                        icon: ExclamationTriangleIcon,
                        color: "rose"
                    })
                    return
                } else {
                    setShowCallout({
                        title: 'Importação concluida',
                        description: 'Vê as tuas empresas para consultares os novos dados!',
                        icon: CheckCircleIcon,
                        color: 'teal'
                    })

                    queryClient.invalidateQueries({queryKey: ['companies']}).then(console.log)
                }

                setShowSpin(false)
            }
            reader.readAsArrayBuffer(file)
        })
    }, [queryClient])

    const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
        onDrop,
        accept: {'text/xml': ['.xml']}
    })

    const dropZoneMarkup = (
        <div className={classNames(
            "mt-6 flex flex-col justify-center items-center rounded-lg border-2 border-solid hover:border-indigo-400 cursor-pointer transition-all px-6 h-40 bg-white",
            isDragAccept ? 'border-emerald-400' : null,
            isDragReject ? 'border-red-400' : null
        )} {...getRootProps()}>
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true"/>
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <div className={classNames(
                    'relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600',
                    'focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600',
                    'focus-within:ring-offset-2 hover:text-indigo-500'
                )}
                >
                    <span>Upload SAF-T</span>
                    <input {...getInputProps()} className="sr-only"/>
                </div>
            </div>
        </div>
    )

    return (
        <main className="max-w-6xl mx-auto pt-16 sm:pt-8 px-8">
            <Title>Import</Title>
            <Text>Import a SAF-T file to add a new company or update data of an existing company!</Text>

            <Tabs tabs={[
                {route: '/', name: 'My companies'},
                {route: 'saft', name: 'Import SAF-T'}
            ]}/>

            {showCallout != undefined && <Callout
                className="mt-4"
                title={showCallout.title}
                icon={showCallout.icon}
                color={showCallout.color}
            >
                {showCallout.description}
            </Callout>}

            {!showSpin ? dropZoneMarkup : <SpinSkeleton/>}
        </main>
    )
}

export default SAFT
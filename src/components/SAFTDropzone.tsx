import {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {DocumentIcon} from "@heroicons/react/24/outline";

const classNames = (...s: (string | null)[]) => s.filter(Boolean).join(' ');

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
                const response = await fetch('/api/saft/dom', {
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

    const {getRootProps, getInputProps, isDragAccept, isDragReject} = useDropzone({
        onDrop,
        accept: {'text/xml': ['.xml']}
    })

    return (
        <div className="mt-6" {...getRootProps()}>
            <div className={classNames(
                "mt-2 flex justify-center rounded-lg border-2 border-solid hover:border-indigo-400 cursor-pointer transition-all px-6 py-10 bg-white",
                isDragAccept ? 'border-emerald-400' : null,
                isDragReject ? 'border-red-400' : null
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

export default SAFTDropzone
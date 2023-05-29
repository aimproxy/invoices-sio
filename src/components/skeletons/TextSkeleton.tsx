const TextSkeleton = () => {
    return (
        <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
            <div className="flex items-center w-full space-x-2">
                <div className="h-2.5 bg-gray-200 rounded-full w-32"/>
            </div>
        </div>
    )
}

export default TextSkeleton
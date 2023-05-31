const ChartSkeleton = () => (
    <div role="status" className="animate-pulse flex items-baseline mt-4 space-x-6">
            <div className="w-full bg-gray-200 rounded-t-lg h-72"></div>
            <div className="w-full h-56 bg-gray-200 rounded-t-lg"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-72"></div>
            <div className="w-full h-64 bg-gray-200 rounded-t-lg"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-80"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-72"></div>
            <div className="w-full h-56 bg-gray-200 rounded-t-lg"></div>
            <div className="w-full bg-gray-200 rounded-t-lg h-72"></div>
            <span className="sr-only">Loading...</span>
    </div>
)

export default ChartSkeleton
const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
};

export default Loader;

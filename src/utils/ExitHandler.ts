export default (callback: Function) => {
	const handler = () => {
		callback();
    };
    //ctrl+c events
    process.on("SIGINT", handler);
    //process.exit()
    process.on("exit", handler);
    process.on('uncaughtException', () => {
        
    });
};

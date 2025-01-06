interface RPCQL {
	namespace: string;
	actions: RPCQLAction[];
}

interface RPCQLAction {
	name: string;
	description: string;
	params: RPCQLParameter[];
	permissionRequired: string;
	execute: (
		data: any,
		logAction: (
			userid: string,
			reason: string,
			action: string
		) => Promise<boolean | Error>
	) => Promise<boolean | Error>;
}

interface RPCQLParameter {
	name: string;
	description: string;
}

export { RPCQL, RPCQLParameter, RPCQLAction };

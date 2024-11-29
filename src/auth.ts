import * as database from "database";
import { hasPerm } from "purrperms";

const getAuth = async (token: string, perm: string) => {
	let apiToken: any;

	if (token === "" || token === null || token === undefined)
		throw new Error(
			"A token was not passed with this request, in the `Authorization` header. Please provide a valid token in the `Authorization` header."
		);
	else {
		try {
			/*
			 * In this area, replace this comment with code to get the SessionData from the SessionToken
			 */
		} catch (error) {
			apiToken = await database.Applications.get(token);
		}

		const getUser = async (user_id: string) => {};

		// Developer API Method
		if (apiToken && "creatorid" in apiToken) {
			if (apiToken.active) {
				if (hasPerm(apiToken.permissions, perm))
					return getUser(apiToken.creatorid) || null;
				else
					throw new Error(
						`Missing Permissions. This token does not have enough permissions to perform this action. This token has access to ${apiToken.permissions.join(
							", "
						)}. To access this token, you must enable the following permissions on our Developer Portal: ${perm}. Please note that some of our permissions are Privilaged Access only and cannot be enabled on the Developer Portal.`
					);
			} else
				throw new Error(
					"Unauthorized. This token is not accepting requests, at this time. To continue allowing requests, re-enable the token on our Developer Portal."
				);
		} else return null;
	}
};

export { getAuth };

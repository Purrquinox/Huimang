/**
 * Checks if a user has a permission
 * @param {string[]} perms - An array of permissions
 * @param {string} perm - The permission to check
 * @returns {boolean} Whether the user has the permission or not
 */
export const hasPerm = (perms: string[], perm: string): boolean => {
	let perm_split = perm.split(".");
	if (perm_split.length < 2) perm_split = [perm, "*"];

	const perm_namespace = perm_split[0];
	const perm_name = perm_split[1];

	let has_negator = false;
	let has_positive = false;

	for (const user_perm of perms) {
		let user_perm_split = user_perm.split(".");
		if (user_perm_split.length < 2) user_perm_split = [user_perm, "*"];

		let user_perm_namespace = user_perm_split[0];
		const user_perm_name = user_perm_split[1];

		const is_negator = user_perm.startsWith("~");
		if (is_negator) user_perm_namespace = user_perm_namespace.substring(1);

		if (
			(user_perm_namespace === perm_namespace ||
				user_perm_namespace === "global") &&
			(user_perm_name === "*" || user_perm_name === perm_name)
		) {
			if (is_negator) {
				has_negator = true;
			} else {
				has_positive = true;
			}
		}
	}

	if (has_negator) return false;
	return has_positive;
};

/**
 * Builds a permission
 * @param {string} namespace - The permission's namespace
 * @param {string} perm - The permission's name
 * @returns {string} The built permission
 */
export const build = (namespace: string, perm: string): string => {
	return `${namespace}.${perm}`;
};

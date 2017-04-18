/**
 * Created by onvelocity on 4/18/17.
 */

/**
 * Only supports minimal operation support on a simple table with 'id' as primary key.
 *
 * @param state
 * @returns {{scan: (function(*, *)), putItem: (function(*, *)), deleteItem: (function(*, *))}}
 */
export const mockMinimalOperations = (state = {}) => {
	return {
		/**
		 * Only return the full table.
		 *
		 * @param query
		 * @param done
		 */
		scan(query, done) {
			const table = state[query.TableName] || [];
			const response = {Items: table};
			done(undefined, response);
		},
		/**
		 * Only replaces existing object or inserts a new object.
		 *
		 * @param query
		 * @param done
		 */
		putItem(query, done) {
			const table = state[query.TableName] || [];
			const object = Object.assign({}, query.Item);
			const updateId = object.id;
			const updated = table.map((obj) => {
				if (obj.id === updateId) {
					// update existing object
					return object;
				}
				return obj;
			});
			if (updated.filter(obj => obj === object).length === 0) {
				// insert a new object
				updated.push(object);
			}
			state[query.TableName] = updated;
			const response = {Count: updated.length};
			done(undefined, response);
		},
		/**
		 * Only removes object with given query.Key.id from given query.TableName.
		 *
		 * Objects in the given TableName must contain a field named 'id'.
		 *
		 * @param query
		 * @param done
		 */
		deleteItem(query, done) {
			const table = state[query.TableName] || [];
			const startLength = table.length;
			const idToDelete = query.Key.id;
			const update = table.filter((obj) => obj.id !== idToDelete);
			const response = {Count: startLength - update.length};
			state[query.TableName] = update;
			done(undefined, response);
		}
	}
};

export default mockDynamoDB = mockMinimalOperations;

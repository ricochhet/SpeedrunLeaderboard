class Array {
	removeObjectDuplicates(arr) {
		return arr.reduce(
			function (p, c) {
				var id = [c.x, c.y].join("|");
				if (p.temp.indexOf(id) === -1) {
					p.out.push(c);
					p.temp.push(id);
				}

				return p;
			},
			{
				temp: [],
				out: [],
			}
		).out;
	}

	dynamicSort(property) {
		let sortOrder = 1;

		if (property[0] === "-") {
			sortOrder = -1;
			property = property.substr(1);
		}

		return function (a, b) {
			let result =
				a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
			return result * sortOrder;
		};
	}

	dynamicSortMultiple() {
		let props = arguments;
		const self = this;
		
    return function (obj1, obj2) {
			let i = 0, result = 0, numberOfProperties = props.length;
			
			while(result === 0 && i < numberOfProperties) {
				result = self.dynamicSort(props[i])(obj1, obj2);
				i++;
			}
			
			return result;
    }
}
}

module.exports = new Array();

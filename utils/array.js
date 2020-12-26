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
}

module.exports = new Array();

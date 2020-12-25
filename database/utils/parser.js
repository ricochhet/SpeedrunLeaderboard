class Parser {
  toArray(data) {
    const array = [];

    for (const i in data) {
      array.push(data[i]);
    }

    return array;
  }

  toJSON(data) {
    return JSON.parse(data);
  }
}

module.exports = new Parser();
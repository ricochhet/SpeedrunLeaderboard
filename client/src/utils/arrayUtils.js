export default {
  toURL(str) {
    return str
      .toLowerCase()
      .split(" ")
      .join("-")
      .split("'")
      .join("")
      .split('"')
      .join("")
      .split("(")
      .join("")
      .split(")")
      .join("");
  }
};

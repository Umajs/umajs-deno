import { Path } from "https://deno.land/x/path/mod.ts";

export const path = {
  resolve: function (root: string, dir: string): string {
    let rootPath = new Path(root);

    if (/^.\/|^[A-Za-z0-9]/.test(dir)) {
      rootPath.push(dir.replace("./", ""));

      return rootPath.toString();
    }

    if (/^..\//.test(dir)) {
      let regResult = new RegExp(/^(..\/){1,}/, "g").exec(dir) || [];
      let prefix = regResult[0] || "";

      for (let i = 1; i < prefix.split("/").length; i++) {
        rootPath.pop();
      }
      rootPath.push(dir.replace(prefix, ""));

      return rootPath.toString();
    }

    return `${root}/${dir}`;
  },
  parse: function (filePath: string) {
    let fileInfo = new Path(filePath);

    return {
      name: fileInfo.elements.pop() || "",
    };
  },
  basename: function (filePath: string) {
    let fileInfo = new Path(filePath);

    return fileInfo.elements.pop() || "";
  },
  join: function (root: string, dir: string) {
    let rootPath = new Path(root);

    if (/^.\/|^[A-Za-z0-9]/.test(dir)) {
      rootPath.push(dir.replace("./", ""));

      return rootPath.toString();
    }

    if (/^..\//.test(dir)) {
      let regResult = new RegExp(/^(..\/){1,}/, "g").exec(dir) || [];
      let prefix = regResult[0] || "";

      for (let i = 1; i < prefix.split("/").length; i++) {
        rootPath.pop();
      }
      rootPath.push(dir.replace(prefix, ""));

      return rootPath.toString();
    }

    return `${root}/${dir}`;
  },
};

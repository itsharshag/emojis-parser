import fs from "fs";

const EMOJIS_FILE_PATH = "emoji-test.txt";
const GROUP_MARKER = "# group: ";
const SUBGROUP_MARKER = "# subgroup: ";

const parseEmojiLine = (line) => {
  const r1 = line.split(";");
  const r1LastItem = r1[r1.length - 1];
  const r2 = r1LastItem.split(" ").filter((item) => item != "");

  const name = r2.slice(4).join(" ").trim();
  const emoji = r2[2].trim();

  return { n: name, e: emoji };
};

const main = () => {
  const file = fs.readFileSync(EMOJIS_FILE_PATH, "utf-8");
  const lines = file.split("\n");
  const groups = [];
  let emojisCount = 0;

  let currentGroup = {
    name: "",
    subgroups: [],
  };

  let currentSubGroup = {
    name: "",
    items: [],
  };

  for (const line of lines) {
    if (line.startsWith(GROUP_MARKER)) {
      if (currentGroup.name == "") {
        currentGroup.name = line.replace(GROUP_MARKER, "").trim();
        continue;
      }
      groups.push(currentGroup);
      currentGroup = {
        name: "",
        subgroups: [],
      };
      currentGroup = {
        name: "",
        subgroups: [],
      };
      currentSubGroup = {
        name: "",
        items: [],
        groups: [],
      };
    } else if (line.startsWith(SUBGROUP_MARKER)) {
      if (currentSubGroup.name == "") {
        currentSubGroup.name = line.replace(SUBGROUP_MARKER, "").trim();
        continue;
      }

      currentGroup.subgroups.push(currentSubGroup);
      currentSubGroup = {
        name: "",
        subgroups: [],
      };
      currentSubGroup = {
        name: "",
        items: [],
        groups: [],
      };
    } else if (line.includes("qualified") && line.includes(";")) {
      currentSubGroup.items.push(parseEmojiLine(line));
      emojisCount += 1;
    }
  }
  currentGroup.subgroups.push(currentSubGroup);
  groups.push(currentGroup);
  console.log({ emojisCount });
  fs.writeFileSync("emojis.json", JSON.stringify(groups));
};

main();

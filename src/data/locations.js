const locations = [
  {
    id: 1,
    name: "Shradel",
    x: "40%",
    y: "30%",
    description: "The city of endless secrets.",
    quests: [
      { title: "Shadows Over Shradel", status: "Active" },
      { title: "The Whispering Vault", status: "Completed" }
    ],
    npcs: ["High Archivist Malven", "The Masked Oracle"]
  },
  {
    id: 2,
    name: "Grayhearth",
    x: "60%",
    y: "70%",
    description: "Dwarven capital deep in the mountains.",
    quests: [
      { title: "Siege of the Deep", status: "Active" }
    ],
    npcs: ["Thane Brokk Emberforge"]
  },
  {
    id: 3,
    name: "Far Rift",
    x: "75%",
    y: "20%",
    description: "A chaotic rift to the Far Realm.",
    quests: [
      { title: "Contain the Rift", status: "Ongoing" }
    ],
    npcs: ["Kaorti Harbinger", "Mad Prophet Zix"]
  }
];

export default locations;

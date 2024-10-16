import kafka from "./kafka";

export async function adminInit() {
  const admin = kafka.admin();
  console.log("Admin connecting...");
  admin.connect();
  console.log("Adming Connection Success...");

  console.log("Creating Topic game-update");
  await admin.createTopics({
    topics: [
      {
        topic: "game-update",
        numPartitions: 1,
      },
    ],
  });
  console.log("Topic Created Success [game-update]");

  console.log("Disconnecting Admin..");
  await admin.disconnect();
}

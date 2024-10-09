import kafka from "./kafka";

export async function kafkaInit() {
  try {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    await admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating Topic [Moves Consumer]");
    const topic_success = await admin.createTopics({
      topics: [
        {
          topic: "moves-update",
          numPartitions: 2,
        },
      ],
    });
    if (topic_success) {
      console.log("Topic Created Success");
      console.log("Disconnecting Admin..");
      await admin.disconnect();
    } else {
      throw new Error("Topic Creation Failed");
    }
  } catch (e: any) {
    console.log("Kafka Admin Error: \n", e);
  }
}

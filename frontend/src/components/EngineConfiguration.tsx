import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Slider } from "@nextui-org/slider";
import { useState } from "react";
import { EngineDetails } from "../utils/config";
import { Button } from "@nextui-org/button";

const EngineConfiguration = ({
  selectedEngine,
  setSelectedEngine,
  initializeWorker,
}: any) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Select
        label="Select Engine"
        className="max-w-[20rem] w-full m-4"
        classNames={{
          listbox: "bg-[#3C3B39] text-white",
          popoverContent: "bg-[#3C3B39]",
          // mainWrapper: "bg-[#3C3B39]",
          // base: "bg-[#3C3B39]",[#3C3B39]
          trigger: "bg-[#3C3B39]",
          // innerWrapper: "bg-[#3C3B39]",
        }}
        selectedKeys={[selectedEngine]}
        onSelectionChange={(e) => {
          e.anchorKey && setSelectedEngine(e.anchorKey);
        }}
      >
        {EngineDetails.map((detail) => (
          <SelectItem key={detail.key}>{detail.label}</SelectItem>
        ))}
      </Select>
      <Slider
        size="md"
        step={1}
        color="foreground"
        label="Depth"
        showSteps={true}
        showTooltip={true}
        maxValue={30}
        minValue={12}
        defaultValue={20}
        className="w-2/3"
        classNames={{
          // mark:"bg-red-500",
          track: "bg-zinc-400",
          // step: "bg-blue-500"
          thumb: "bg-zinc-400 z-10",
        }}
      />
      <Button
        size="md"
        className="max-w-[20rem] w-full bg-[#2ea44f] hover:bg-[#2c974b] text-lg font-medium"
        onClick={() => {
          console.log("clicked");
          initializeWorker(selectedEngine);
        }}
      >
        Apply
      </Button>
    </div>
  );
};

const EngineInfo = ({ initializeWorker }: any) => {
  const [selectedKey, setSelectedKey] = useState("engine");
  const [selectedEngine, setSelectedEngine] = useState("stockfish-16.1");
  return (
    <div className="w-[35%] md:w-11/12 lg:w-11/12 md:min-h-[30rem] lg:min-h-[30rem] h-full flex flex-col bg-[#262522] m-0 p-0 rounded-[1.6%] pb-2">
      <Tabs
        aria-label="Options"
        fullWidth={true}
        color="primary"
        selectedKey={selectedKey}
        onSelectionChange={(key) => {
          setSelectedKey(key.toString());
        }}
        classNames={{
          tabList: "bg-[#21201D]",
          tab: "h-10",
          panel: "h-full rounded-[1.6%] flex-grow",
          cursor: "w-full bg-[#262522]",
          // base: "bg-red-400",
          tabContent: "text-8 text-white",
        }}
      >
        <Tab key={"engine"} title={"Engine"}>
          <EngineConfiguration
            selectedEngine={selectedEngine}
            setSelectedEngine={setSelectedEngine}
            initializeWorker={initializeWorker}
          />
        </Tab>
        <Tab key={"history"} title={"History"}></Tab>
      </Tabs>
    </div>
  );
};

export default EngineInfo;

import { Select, SelectItem } from "@nextui-org/select";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Slider } from "@nextui-org/slider";
import { useEffect, useState } from "react";
import { EngineDetails } from "../utils/config";
import { Button } from "@nextui-org/button";
import { Progress } from "@nextui-org/progress";

const PlayAsButton = () => {
  const [selected, setSelected] = useState("white");

  const handleSelect = (color: string) => {
    setSelected(color);
  };

  return (
    <div className="flex flex-row gap-4 items-center justify-center">
      Play as:
      <button
        onClick={() => handleSelect("white")}
        className={`m-2 text-base font-normal px-2 py-1 rounded ${
          selected === "white"
            ? "bg-[#2ea44f] border-2 border-[#22863a] text-white"
            : "bg-[#383636] hover:bg-[#2ea44f] hover:text-white"
        }`}
      >
        White
      </button>
      <button
        onClick={() => handleSelect("black")}
        className={`m-2 text-base font-normal px-2 py-1 rounded ${
          selected === "black"
            ? "bg-[#2ea44f] border-2 border-[#22863a] text-white"
            : "bg-[#383636] hover:bg-[#2ea44f] hover:text-white"
        }`}
      >
        Black
      </button>
    </div>
  );
};

const SliderComponent = ({
  label,
  minVal,
  maxVal,
  defaultVal,
  setvalue,
}: any) => {
  return (
    <Slider
      size="sm"
      step={1}
      color="foreground"
      label={label}
      showTooltip={true}
      maxValue={maxVal}
      minValue={minVal}
      defaultValue={defaultVal}
      className="w-2/3"
      classNames={{
        // mark:"bg-red-500",
        track: "bg-zinc-400",
        // step: "bg-blue-500"
        thumb: "bg-zinc-400 z-10",
      }}
      onChange={(value) => {
        setvalue(value);
      }}
    />
  );
};
const SelectComponent = ({ label, options, selected, setSelected }: any) => {
  return (
    <Select
      label={label}
      className="max-w-[20rem] w-full m-4"
      classNames={{
        listbox: "bg-[#3C3B39] text-white",
        popoverContent: "bg-[#3C3B39]",
        // mainWrapper: "bg-[#3C3B39]",
        // base: "bg-[#3C3B39]",[#3C3B39]
        trigger: "bg-[#3C3B39]",
        // innerWrapper: "bg-[#3C3B39]",
      }}
      selectedKeys={[selected]}
      onSelectionChange={(e) => {
        e.anchorKey && setSelected(e.anchorKey);
      }}
    >
      {options.map((option: any) => (
        <SelectItem key={option.key}>{option.label}</SelectItem>
      ))}
    </Select>
  );
};

const EngineInfo = ({
  initializeWorker,
  downloadProgress,
  setEngineConfiguration,
}: any) => {
  const [selectedTab, setSelectedTab] = useState("engine");
  const [selectedEngine, setSelectedEngine] = useState("stockfish-16.1");
  const [isMultithreaded, setIsMultithreaded] = useState(false);
  const [threads, setThreads] = useState(1);
  const [depth, setDepth] = useState(20);
  const [searchTime, setSearchTime] = useState(5); // value in seconds but should stored in ms
  // const [multipv, setMultipv] = useState(1);
  // const [elo, setElo] = useState(0);

  useEffect(() => {
    const engine = EngineDetails.find(
      (engine) => engine.key === selectedEngine
    );
    if (engine) {
      setIsMultithreaded(engine.multiThreaded);
    }
  }, [selectedEngine]);

  const handleApply = (prev: any) => {
    let t = searchTime * 1000;
    setEngineConfiguration({
      ...prev,
      threads: threads,
      depth: depth,
      time: t,
      // multipv,
      // elo,
    });
    initializeWorker(selectedEngine);
  };
  return (
    <div className="w-[35%] md:w-11/12 lg:w-11/12 md:min-h-[30rem] lg:min-h-[30rem] h-full flex flex-col bg-[#262522] m-0 p-0 rounded-[1.6%] pb-2">
      <Tabs
        aria-label="Options"
        fullWidth={true}
        color="primary"
        selectedKey={selectedTab}
        key="engine"
        title="Engine"
        onSelectionChange={(key) => {
          setSelectedTab(key.toString());
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
          <div className="flex flex-col justify-center items-center gap-2">
            <SelectComponent
              label="Select Engine"
              options={EngineDetails}
              selected={selectedEngine}
              setSelected={setSelectedEngine}
            />
            {downloadProgress.currentlyDownloading !== "" && (
              <Progress
                size="sm"
                label={`Downloading ${downloadProgress.currentlyDownloading}`}
                value={downloadProgress.progress}
                className="w-full max-w-[20rem]"
              />
            )}
            <SliderComponent
              label="Depth"
              minVal={12}
              maxVal={30}
              defaultVal={20}
              setvalue={setDepth}
            />
            <SliderComponent
              label="Search Time(sec)"
              minVal={1}
              maxVal={30}
              defaultVal={5}
              setvalue={setSearchTime}
            />
            {isMultithreaded && (
              <SliderComponent
                label="Threads"
                minVal={1}
                maxVal={8} // TODO: max threads should be calculated based on the system
                defaultVal={1}
                setvalue={setThreads}
              />
            )}
            <PlayAsButton />
            <Button
              size="md"
              className="max-w-[20rem] w-full bg-[#2ea44f] hover:bg-[#2c974b] text-lg font-medium"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </Tab>
        <Tab key={"history"} title={"History"}></Tab>
      </Tabs>
    </div>
  );
};

export default EngineInfo;
